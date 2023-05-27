const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db.sqlite");

db.run(
  "CREATE TABLE IF NOT EXISTS sopaletras (id INTEGER PRIMARY KEY AUTOINCREMENT, Juego TEXT, Colaborador TEXT, Tiempo TEXT, FechaRegistro DATETIME DEFAULT (datetime('now','localtime')))"
);

module.exports = db;
