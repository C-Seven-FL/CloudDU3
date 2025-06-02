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
  },
  required: ["id"],
};

async function GetAbl(req, res) {
  try {
    const ajv = new Ajv();
    const body = req.query.id ? req.query : req.body;
    const valid = ajv.validate(schema, body);
    if (valid) {
      const exerciseID = body.id;
      const exercise = await dao.getExercise(exerciseID);
      if (!exercise) {
        res
          .status(400)
          .send({ error: `workout record with id '${exerciseID}' doesn't exist` });
      }
      res.json(exercise);
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
