const path = require("path");
const Ajv = require("ajv").default;
const WrecordDao = require("../../dao/wrecord-dao");
let dao = new WrecordDao(
  path.join(__dirname, "..", "..", "storage", "wrecord.json")
);

const ExerciseDao = require("../../dao/exercise-dao");
let exdao = new ExerciseDao(
  path.join(__dirname, "..", "..", "storage", "exercise.json")
);

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

async function DeleteAbl(req, res) {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, req.body);
  try {
    if (valid) {
      const wrecordId = req.body.id;
      let wrecord = await dao.getWrecord(wrecordId);
      await dao.deleteWrecord(wrecord);

      for (let i = 0; i < wrecord.exerciseID.length; i++) {
        await exdao.deleteExercise([{id: wrecord.exerciseID[i]}, "wrecord"])
      }

      res.json({});
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: req.body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
}

module.exports = DeleteAbl;
