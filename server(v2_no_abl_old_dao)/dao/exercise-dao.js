"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

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
    exerciseList.push(exercise);
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

  async deleteExercise(id) {
    let exerciseList = await this._loadAllExercises();
    const exerciseIndex = exerciseList.findIndex((b) => b.id === id);
    if (exerciseIndex >= 0) {
      exerciseList.splice(exerciseIndex, 1);
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(exerciseList, null, 2)
    );
    return {};
  }

  async listExercises() {
    let exerciseList = await this._loadAllExercises();
    return exerciseList;
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