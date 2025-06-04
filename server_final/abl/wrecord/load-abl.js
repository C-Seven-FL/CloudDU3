const path = require("path");
const Ajv = require("ajv").default;
const WrecordDao = require("../../dao/wrecord-dao");
let dao = new WrecordDao(
  path.join(__dirname, "..", "..", "storage", "wrecord.json")
);

let schema = {
  type: "object",
  properties: {
    daterate: { type: "string" },
    month: { type: "integer" },
    year: { type: "integer" }
  },
  required: ["daterate", "year"],
};

async function LoadAbl(req, res) {
  try {
    const ajv = new Ajv();
    const body = req.query.id ? req.query : req.body;
    const valid = ajv.validate(schema, body);
    if (valid) {
      const wrecord = await dao.loadWrecord(body);
      if (!wrecord) {
        res
          .status(400)
          .send({ error: `There is no workout record in this period.` });
      }
      res.json(wrecord);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }
}

module.exports = LoadAbl;