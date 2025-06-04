const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/wrecord/create-abl");
const GetAbl = require("../abl/wrecord/get-abl");
const LoadAbl = require("../abl/wrecord/load-abl");
const UpdateAbl = require("../abl/wrecord/update-abl");
const DeleteAbl = require("../abl/wrecord/delete-abl");

router.post("/create", async (req, res) => {
  await CreateAbl(req, res);
});

router.get("/get", async (req, res) => {
  await GetAbl(req, res);
});

router.post("/load", async (req, res) => {
  await LoadAbl(req, res);
});

router.post("/update", async (req, res) => {
  await UpdateAbl(req, res);
});

router.post("/delete", async (req, res) => {
  await DeleteAbl(req, res);
});

module.exports = router;
