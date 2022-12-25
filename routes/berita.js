const express = require("express");
const { db, checkAuth } = require("../server");
const router = express.Router();

router.use(express.json());
router.use(express.text());

//lihat kategori
router.get("/kategori", async (req, res) => {
  const kategori = await db.all("SELECT * FROM kategori");
  res.json(kategori);
});

//lihat berita
router.get("/", async (req, res) => {
  res.json(await db.all(`SELECT rowid, * FROM berita;`));
});

//berita baru
router.post("/", async (req, res) => {
  const token = req.headers["authorization"];
  const judul = req.body.judul;
  const kategori = req.body.kategori;
  const isi = req.body.isi;

  //cek judul kategori dan isi
  if (!(judul && kategori && isi)) {
    res.sendStatus(400);
    return;
  }
  //cek error
  if (!checkAuth(token).error) {
    try {
      await db.run(
        `INSERT INTO berita VALUES ('${judul}', '${kategori}', '${isi}')`
      );
    } catch (error) {
      switch (error.errno) {
        case 19:
          res.sendStatus(400);
          return;
      }
    }
    res.sendStatus(200);
    return;
  }

  res.sendStatus(403);
});

//hapu berita
router.delete("/", async (req, res) => {
  const token = req.headers.authorization;
  if (!checkAuth(token).error) {
    const id = req.body;
    try {
      await db.run(`DELETE FROM berita WHERE rowid = '${id}'`);
    } catch {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(200);
    return;
  }
  res.sendStatus(401);
});

module.exports = router;
