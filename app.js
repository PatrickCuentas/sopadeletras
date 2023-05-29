const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/colaborador/:id", (req, res) => {
  const { id } = req.params;

  db.all(`SELECT * FROM sopaletras WHERE Colaborador = ${id}`, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error en la base de datos");
    }
    if (rows.length > 0) {
      res.status(303).json({
        message: "El colaborador con ese número ya resolvió el juego",
      });
    } else {
      res.status(200).json({
        message: "ok",
      });
    }
  });
});

app.post("/new", (req, res) => {
  const { Juego, Colaborador, Tiempo } = req.body;
  db.run(
    `INSERT INTO sopaletras (Juego, Colaborador, Tiempo) VALUES ("${Juego}", "${Colaborador}", "${Tiempo}")`
  );
  res.send("ok");
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
