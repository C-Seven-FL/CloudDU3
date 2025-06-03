//načtení modulu express
const express = require("express");
const cors = require("cors");

const exerciseRouter = require("./controller/exercise-controller");
const wrecordRouter = require("./controller/wrecord-controller");

//inicializace nového Express.js serveru
const app = express();
//definování portu, na kterém má aplikace běžet na localhostu
const port = process.env.PORT || 8888;

// Parsování body
app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.use(cors())

//jednoduchá definice routy s HTTP metodou GET, která pouze navrací text
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/exercise", exerciseRouter);
app.use("/wrecord", wrecordRouter);

app.get("/*", (req, res) => {
  res.send("Unknown path!");
});

//nastavení portu, na kterém má běžet HTTP server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});