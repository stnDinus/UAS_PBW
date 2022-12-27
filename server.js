const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const jwt = require("jsonwebtoken");
require("dotenv").config();

(async () => {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  db.run("PRAGMA foreign_keys = ON");
  //tabel user
  db.run(`
  CREATE TABLE IF NOT EXISTS user (
    username TEXT PRIMARY KEY NOT NULL,
    password TEXT NOT NULL
  )
`);
  //tabel kategori
  db.run(`
  CREATE TABLE IF NOT EXISTS kategori (
    kategori TEXT PRIMARY KEY
  )
`);
  //tabel berita
  db.run(`
  CREATE TABLE IF NOT EXISTS berita (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    judul TEXT,
    kategori TEXT,
    isi TEXT,
    FOREIGN KEY(kategori) REFERENCES kategori(kategori) ON DELETE CASCADE ON UPDATE CASCADE
  )
`);
  //tabel vkegiatan
  db.run(`
  CREATE TABLE IF NOT EXISTS vkegiatan (
    judul TEXT,
    link TEXT
  )
`);
  //tabel galeri
  db.run(`
  CREATE TABLE IF NOT EXISTS galeri (
    judul TEXT,
    link TEXT
  )
`);
  //tabel aduan
  db.run(`
  CREATE TABLE IF NOT EXISTS aduan (
    judul TEXT,
    isi TEXT
  )
`);
  //tabel komentar
  db.run(`
  CREATE TABLE IF NOT EXISTS komentar (
    oleh TEXT NOT NULL,
    beritaId INTEGER,
    isi TEXT NOT NULL,
    waktu TEXT,
    FOREIGN KEY(oleh) REFERENCES user(username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(beritaId) REFERENCES berita(id) ON DELETE CASCADE ON UPDATE CASCADE
  )
`);

  checkAuth = async (token) => {
    try {
      const status = jwt.verify(token, process.env["ACCESS_TOKEN_SECRET"]);
      if (
        await db.get(
          `SELECT username FROM user WHERE username = '${status.username}'`
        )
      ) {
        return status;
      }
      throw "username tidak ada di database";
    } catch (error) {
      return 0;
    }
  };

  module.exports = { db, checkAuth };

  const app = express();

  //konten static
  app.use(express.static("static"));

  //routing /uesr/*
  app.use("/user", require("./routes/user"));

  //routing /berita/*
  app.use("/berita", require("./routes/berita"));

  //routing /komentar/*
  app.use("/komentar", require("./routes/komentar"));

  const port = 80;
  app.listen(port, () => {
    console.clear();
    console.log("Server Berjalan pada port: ", port);
  });
})();
