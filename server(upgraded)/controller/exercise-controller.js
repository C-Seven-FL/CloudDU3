const express = require("express");
const router = express.Router();

const AddAbl = require("../abl/exercise/add-abl");
const GetAbl = require("../abl/exercise/get-abl");
const LoadAbl = require("../abl/exercise/load-abl");
const UpdateAbl = require("../abl/exercise/update-abl");
const DeleteAbl = require("../abl/exercise/delete-abl");

router.post("/add", async (req, res) => {
  await AddAbl(req, res);
});

router.get("/get", async (req, res) => {
  await GetAbl(req, res);
});

router.get("/load", async (req, res) => {
  await LoadAbl(req, res);
});

router.post("/update", async (req, res) => {
  await UpdateAbl(req, res);
});

router.post("/delete", async (req, res) => {
  await DeleteAbl(req, res);
});

module.exports = router;
