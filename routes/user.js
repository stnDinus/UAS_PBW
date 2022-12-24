const express = require("express");
const { db } = require("../server");
const router = express.Router();

router.use(express.json());

router.post("/checkUsername", (req, res) => {
  if (req.body.username) {
    db.get(
      `SELECT username FROM user WHERE username = '${req.body.username}'`,
      (err, row) => {
        !row ? res.sendStatus(200) : res.sendStatus(406);
      }
    );
  }
});

router.post("/login", (req, res) => {
  console.log(req.body);
  res.end();
});

module.exports = router;
