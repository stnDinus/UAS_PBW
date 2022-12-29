const express = require("express");
const { db, checkAuth } = require("../server");

const router = express.Router();

router.use(express.json());

router.post("/new", (req, res) => {
  const token = req.headers.authorization;
  const nama = req.body.nama;
  const blob = req.body.blob;
  const deskripsi = req.body.deskripsi;

  if (nama && blob && checkAuth(token)) {
    //db.run(`INSERT INTO galeri VALUES ('${nama}', '${blob}', ${deskripsi})`);
    console.log(nama, blob, deskripsi);
  }
});

module.exports = router;
