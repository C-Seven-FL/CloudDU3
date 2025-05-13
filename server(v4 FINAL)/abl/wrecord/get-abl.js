const path = require("path");
const Ajv = require("ajv").default;
const WrecordDao = require("../../dao/wrecord-dao");
let dao = new WrecordDao(
  path.join(__dirname, "..", "..", "storage", "wrecord.json")
);

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

async function GetAbl(req, res) {
  try {
    const ajv = new Ajv();
    const body = req.query.id ? req.query : req.body;
    const valid = ajv.validate(schema, body);
    if (valid) {
      const wrecordID = body.id;
      const wrecord = await dao.getWrecord(wrecordID);
      if (!wrecord) {
        res
          .status(400)
          .send({ error: `workout record with id '${wrecordID}' doesn't exist` });
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

module.exports = GetAbl;
