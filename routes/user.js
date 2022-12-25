const express = require("express");
const { db } = require("../server");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
    db.run(`INSERT INTO user VALUES ('${username}', '${hash}')`);
    res.sendStatus(200);
  } else {
    res.sendStatus(406);
  }
});

router.post("/login", async (req, res) => {
  const inputUsername = req.body.username;
  const inputPassword = req.body.password;

  const password = await db.get(
    `SELECT password FROM user WHERE username = '${inputUsername}'`
  );

  if (password && (await bcrypt.compare(inputPassword, password.password))) {
    const accessToken = jwt.sign(
      { username: inputUsername },
      process.env["ACCESS_TOKEN_SECRET"]
    );
    res.send(accessToken);
  } else {
    res.sendStatus(406);
  }
});

module.exports = router;
