const express = require("express");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./database.db");

//tabel user
db.run(`
  CREATE TABLE IF NOT EXISTS user (
    nama TEXT,
    password TEXT,
    isAdmin INTEGER
  )
`);
//tabel kategori
db.run(`
  CREATE TABLE IF NOT EXISTS kategori (
    kategori TEXT
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

module.exports = { db };

const app = express();

app.use(express.static("static"));

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const port = 80;
app.listen(port, () => {
  console.clear();
  console.log("Server Berjalan pada port: ", port);
});
