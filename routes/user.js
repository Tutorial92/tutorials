const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const cookie = require("cookie-parser");
const config = require("../helper/config");

const createToken = id => {
  return jwt.sign({ id }, config.JWT_SECRET, { expiresIn: "1h" });
};
// Register new user
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .send({ status: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    console.log("111", newUser);

    await newUser.save();

    const token = createToken(newUser);
    console.log("token", token);

    res.send({ status: true, message: "successfully signup", token: token });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Server error during signup",
    });
  }
});

// LogIn
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  await User.findOne({ email: email })
    .then(userObj => {
      if (userObj) {
        const isMatch = bcrypt.compare(password, userObj.password);
        if (isMatch) {
          const token = createToken(userObj);
          res.cookie("access-token", token);
          res.send({
            status: true,
            message: "login successful",
            token: token,
          });
        } else {
          res.status(400).send({
            status: false,
            message: "Password incorrect",
          });
        }
      } else {
        res.status(400).send({
          status: false,
          message: "No record exits",
        });
      }
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

module.exports = router;
