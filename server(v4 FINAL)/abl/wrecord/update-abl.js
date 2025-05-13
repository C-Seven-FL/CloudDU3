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
    name: { type: "string" },
    date: { type: "string"},
    notes: {type: "string", maxLength: 250}
  },
  required: ["id"],
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let wrecord = req.body;
    const valid = ajv.validate(schema, wrecord);
    if (valid) {
      wrecord = await dao.updateWrecord(wrecord);
      res.json(wrecord);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: wrecord,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    if (e.message.startsWith("classroom with given id")) {
      res.status(400).json({ error: e.message });
    }
    res.status(500).send(e);
  }
}

module.exports = UpdateAbl;
