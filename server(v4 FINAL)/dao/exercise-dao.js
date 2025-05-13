"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const WrecordDao = require("../dao/wrecord-dao");
let wrdao = new WrecordDao(
  path.join(__dirname, "..", "storage", "wrecord.json")
);

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "exercise.json");

class ExerciseDao {
  constructor(storagePath) {
    this.exerciseStoragePath = storagePath
      ? storagePath
      : DEFAULT_STORAGE_PATH;
  }

  async addExercise(exercise) {
    let exerciseList = await this._loadAllExercises();
    exercise.id = crypto.randomBytes(8).toString("hex");
    let exercise_parameters = {"sets": 1, "reps": null, "weight": null, "duration": null, "distance": null}
    exercise = {...exercise, ...exercise_parameters}
    exerciseList.push(exercise);
    let wrecord = await wrdao.getWrecord(exercise.wrecordID);
    wrecord.exerciseID.push(exercise.id);
    await wrdao.updateWrecord({ id: exercise.wrecordID, exerciseID: wrecord.exerciseID})
    await wf(
      this._getStorageLocation(),
      JSON.stringify(exerciseList, null, 2)
    );
    return exercise;
  }

  async getExercise(id) {
    let exercise = await this._loadAllExercises();
    const result = exercise.find((b) => b.id === id);
    return result;
  }

  async loadExercise(name) {
    let exercise = await this._loadAllExercises();
    let same_exercises = [];
    for (let i = 0; i < exercise.length; i++) {
      if (exercise[i].name === name) {same_exercises.push(exercise[i])}
    }
    return same_exercises;
  }

  async updateExercise(exercise) {
    let exerciseList = await this._loadAllExercises();
    const exerciseIndex = exerciseList.findIndex(
      (b) => b.id === exercise.id
    );
    if (exerciseIndex < 0) {
      throw new Error(
        `exercise with given id ${exercise.id} does not exists`
      );
    } else {
      exerciseList[exerciseIndex] = {
        ...exerciseList[exerciseIndex],
        ...exercise,
      };
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(exerciseList, null, 2)
    );
    return exerciseList[exerciseIndex];
  }

  async deleteExercise(delId) {
    let exerciseList = await this._loadAllExercises();
    const exerciseIndex = exerciseList.findIndex((b) => b.id === delId[0].id);
    if (exerciseIndex >= 0) {
      exerciseList.splice(exerciseIndex, 1);
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(exerciseList, null, 2)
    );
    if (delId[1] === "exercise") {
      let wrecord = await wrdao.getWrecord(delId[0].wrecordID);
      let new_WrecordList = wrecord.exerciseID.filter(i => i !== delId[0].id);
      wrecord.exerciseID = new_WrecordList;
      let new_record = await wrdao.updateWrecord(wrecord);
      return new_record;
    }
    return {};
  }

  async _loadAllExercises() {
    let exerciseList;
    try {
      exerciseList = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one...");
        exerciseList = [];
      } else {
        throw new Error(
          "Unable to read from storage. Wrong data format. " +
            this._getStorageLocation()
        );
      }
    }
    return exerciseList;
  }

  _getStorageLocation() {
    return this.exerciseStoragePath;
  }
}

module.exports = ExerciseDao;