const express = require("express");
const { db } = require("../server");
const router = express.Router();
const bcrypt = require("bcrypt");

router.use(express.json());

checkUsernameStatus = async (username) => {
  return !(await db.get(
    `SELECT username FROM user WHERE username = '${username}'`
  ));
};

router.post("/checkUsernameStatus", async (req, res) => {
  (await checkUsernameStatus(req.body.username))
    ? res.sendStatus(200)
    : res.sendStatus(406);
});

router.post("/signUp", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const checkUsername =
    username.length &&
    username.length < 12 &&
    (await checkUsernameStatus(username));
  const checkPassword =
    password.length > 6 &&
    password.length < 20 &&
    password.match(/[A-Z]/g) &&
    password.match(/[a-z]/g) &&
    password.match(/[0-9]/g);

  if (checkUsername && checkPassword) {
    //hash password
    const hash = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO user VALUES ('${username}', '${hash}', 0)`);
    res.sendStatus(200);
  } else {
    res.sendStatus(406);
  }
});

module.exports = router;
