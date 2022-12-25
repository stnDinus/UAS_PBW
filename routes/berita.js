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

//lihat semua berita
router.get("/", async (req, res) => {
  res.json(await db.all(`SELECT rowid, judul, kategori FROM berita;`));
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
  if (await checkAuth(token)) {
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

//hapus berita
router.delete("/", async (req, res) => {
  const token = req.headers.authorization;
  if (await checkAuth(token)) {
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

//lihat berita
router.get("/:id", async (req, res) => {
  const berita = await db.get(
    `SELECT * FROM berita WHERE rowid = '${req.params.id}'`
  );
  res.json(berita);
});

module.exports = router;
