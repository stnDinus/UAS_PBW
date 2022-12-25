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
    username TEXT,
    password TEXT
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
    judul TEXT,
    kategori TEXT,
    isi TEXT,
    FOREIGN KEY(kategori) REFERENCES kategori(kategori)
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
    oleh TEXT,
    isi TEXT,
    waktu TEXT,
    FOREIGN KEY(oleh) REFERENCES user(nama)
  )
`);

  checkAuth = (token) => {
    try {
      const status = jwt.verify(token, process.env["ACCESS_TOKEN_SECRET"]);
      return status;
    } catch (error) {
      return error;
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

  const port = 80;
  app.listen(port, () => {
    console.clear();
    console.log("Server Berjalan pada port: ", port);
  });
})();
