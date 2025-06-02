"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "wrecord.json");

class WrecordDao {
  constructor(storagePath) {
    this.wrecordStoragePath = storagePath
      ? storagePath
      : DEFAULT_STORAGE_PATH;
  }

  async createWrecord(wrecord) {
    let wrecordList = await this._loadAllWrecords();
    wrecord.id = crypto.randomBytes(8).toString("hex");
    wrecord.exerciseID = [];
    wrecordList.push(wrecord);
    wrecordList.sort((a, b) => new Date(b.date) - new Date(a.date));
    await wf(
      this._getStorageLocation(),
      JSON.stringify(wrecordList, null, 2)
    );
    return wrecord;
  }

  async getWrecord(id) {
    let wrecord = await this._loadAllWrecords();
    const result = wrecord.find((b) => b.id === id);
    return result;
  }

  async updateWrecord(wrecord) {
    let wrecordList = await this._loadAllWrecords();
    const wrecordIndex = wrecordList.findIndex(
      (b) => b.id === wrecord.id
    );
    if (wrecordIndex < 0) {
      throw new Error(
        `workout record with given id ${wrecord.id} does not exists`
      );
    } else {
      wrecordList[wrecordIndex] = {
        ...wrecordList[wrecordIndex],
        ...wrecord,
      };
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(wrecordList, null, 2)
    );
    return wrecordList[wrecordIndex];
  }

  async deleteWrecord(wrecord) {
    let wrecordList = await this._loadAllWrecords();
    const wrecordIndex = wrecordList.findIndex((b) => b.id === wrecord.id);
    if (wrecordIndex >= 0) {
      wrecordList.splice(wrecordIndex, 1);
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(wrecordList, null, 2)
    );
    return {};
  }

  async loadWrecord(body) {
    let wrecord = await this._loadAllWrecords();
    let date_wrecords = [];
    for (let i = 0; i < wrecord.length; i++) {
      let date = new Date(wrecord[i].date)
      if (body.daterate === "year") {
        if (date.getFullYear() === body.year) {date_wrecords.push(wrecord[i])}
      }
      else {
        if (date.getFullYear() === body.year && date.getMonth()+1 === body.month) {date_wrecords.push(wrecord[i])}
      }
    }
    return date_wrecords;
  }

  async _loadAllWrecords() {
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
    return this.wrecordStoragePath;
  }
}

module.exports = WrecordDao;