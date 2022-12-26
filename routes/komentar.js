const express = require("express");
const { db, checkAuth } = require("../server");
const router = express.Router();

router.use(express.json());

router.get("/", async (req, res) => {
  const beritaId = req.query.beritaId;
  if (beritaId) {
    const komentar = await db.all(
      `SELECT rowid, * FROM komentar WHERE beritaId = '${beritaId}'`
    );
    res.json(komentar);
  } else {
    const komentar = await db.all(`SELECT rowid, * FROM komentar`);
    res.json(komentar);
  }
});

router.delete("/:id", async (req, res) => {
  const rowid = req.params.id;
  const auth = req.headers.authorization;
  if (rowid && checkAuth(auth)) {
    await db.run(`DELETE FROM komentar WHERE rowid = '${rowid}'`);
  }
  res.end();
});

module.exports = router;
