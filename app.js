const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post("/new", (req, res) => {
  const { Juego, Colaborador, Tiempo } = req.body;
  db.run(
    `INSERT INTO sopaletras (Juego, Colaborador, Tiempo) VALUES ("${Juego}", "${Colaborador}", "${Tiempo}")`
  );
  res.send("ok");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
