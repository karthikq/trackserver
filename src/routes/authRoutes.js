const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const findUser = await User.findOne({ email: email });
    if (findUser) {
      return res.status(400).json({ message: "Email Already exists's" });
    } else {
      const user = new User({ email, password });
      await user.save();

      const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
      res.json({ token, email });
    }
  } catch (err) {
    return res.status(422).json(err.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Must provide email and password" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).json({ error: "Invalid password or email" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.json({ token });
  } catch (err) {
    return res.status(422).json({ error: "Invalid password or email" });
  }
});

module.exports = router;
