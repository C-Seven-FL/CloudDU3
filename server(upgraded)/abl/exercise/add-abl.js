const path = require("path");
const Ajv = require("ajv").default;
const ExerciseDao = require("../../dao/exercise-dao");
let dao = new ExerciseDao(
  path.join(__dirname, "..", "..", "storage", "exercise.json")
);

let schema = {
  type: "object",
  properties: {
    name: { type: "string"},
    wrecordID: {type: "string"}
  },
  required: ["name", "wrecordID"],
};

async function AddAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let exercise = req.body;
      exercise = await dao.addExercise(exercise);
      res.json(exercise);
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

module.exports = AddAbl;
