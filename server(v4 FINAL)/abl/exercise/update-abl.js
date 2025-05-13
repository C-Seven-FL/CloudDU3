const path = require("path");
const Ajv = require("ajv").default;
const ExerciseDao = require("../../dao/exercise-dao");
let dao = new ExerciseDao(
  path.join(__dirname, "..", "..", "storage", "exercise.json")
);

let schema = {
  type: "object",
  properties: {
           id: { type: "string" },
         name: { type: "string" },
         sets: { type: "integer"},
         reps: { type: "integer"},
       weight: { type: "number" },
     duration: { type: "string" },
     distance: { type: "number" },
    wrecordID: { type: "string" }
  },
  required: ["id"],
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let exercise = req.body;
    const valid = ajv.validate(schema, exercise);
    if (valid) {
      exercise = await dao.updateExercise(exercise);
      res.json(exercise);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: exercise,
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
