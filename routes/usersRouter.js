const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const passport = require("passport");
const registerValidation = require("./validation/register");
const loginValidation = require("./validation/login");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    res.json(req.user);
  }
);

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(401).json({ msg: "Email already registered" });
    }
    const salt = await bcrypt.genSalt(10, req.body.password);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    console.error(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) return res.status(401).json({ msg: error.details[0].message });

    const userExist = await User.findOne({ email: req.body.email });
    if (!userExist) {
      return res.status(404).json({ msg: "Email not found" });
    }
    const validPass = await bcrypt.compare(
      req.body.password,
      userExist.password
    );
    if (!validPass) {
      return res.status(400).json({ msg: "Password Incorrect" });
    }

    const payload = { id: userExist.id, email: userExist.email };
    const secretOrKey = process.env.secretOrKey;

    jwt.sign(payload, secretOrKey, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({
        success: true,
        token: `Bearer ${token}`,
      });
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
