const path = require("path");
const Ajv = require("ajv").default;
const WrecordDao = require("../../dao/wrecord-dao");
let dao = new WrecordDao(
  path.join(__dirname, "..", "..", "storage", "wrecord.json")
);

let schema = {
  type: "object",
  properties: {
    name: { type: "string", maxLength: 50 },
    date: { type: "string"},
    notes: { type: "string", maxLength: 250 },
  },
  required: ["name", "date"],
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let wrecord = req.body;
      wrecord = await dao.createWrecord(wrecord);
      res.json(wrecord);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: req.body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

module.exports = CreateAbl;
