"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "wrecorder.json");

class WrecorderDao {
  constructor(storagePath) {
    this.wrecorderStoragePath = storagePath
      ? storagePath
      : DEFAULT_STORAGE_PATH;
  }

  async addWrecorder(wrecorder) {
    let wrecorderList = await this._loadAllWrecorders();
    wrecorder.id = crypto.randomBytes(8).toString("hex");
    wrecorderList.push(wrecorder);
    await wf(
      this._getStorageLocation(),
      JSON.stringify(wrecorderList, null, 2)
    );
    return wrecorder;
  }

  async getWrecorder(id) {
    let wrecorder = await this._loadAllWrecorders();
    const result = wrecorder.find((b) => b.id === id);
    return result;
  }

  async updateWrecorder(wrecorder) {
    let wrecorderList = await this._loadAllWrecorders();
    const wrecorderIndex = wrecorderList.findIndex(
      (b) => b.id === wrecorder.id
    );
    if (wrecorderIndex < 0) {
      throw new Error(
        `workout record with given id ${wrecorder.id} does not exists`
      );
    } else {
      wrecorderList[wrecorderIndex] = {
        ...wrecorderList[wrecorderIndex],
        ...wrecorder,
      };
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(wrecorderList, null, 2)
    );
    return wrecorderList[wrecorderIndex];
  }

  async deleteWrecorder(id) {
    let wrecorderList = await this._loadAllWrecorders();
    const wrecorderIndex = wrecorderList.findIndex((b) => b.id === id);
    if (wrecorderIndex >= 0) {
      wrecorderList.splice(wrecorderIndex, 1);
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(wrecorderList, null, 2)
    );
    return {};
  }

  async listWrecorders() {
    let wrecorderList = await this._loadAllWrecorders();
    return wrecorderList;
  }

  async _loadAllWrecorders() {
    let wrecordList;
    try {
      wrecordList = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one...");
        wrecordList = [];
      } else {
        throw new Error(
          "Unable to read from storage. Wrong data format. " +
            this._getStorageLocation()
        );
      }
    }
    return wrecordList;
  }

  _getStorageLocation() {
    return this.wrecorderStoragePath;
  }
}

module.exports = WrecorderDao;