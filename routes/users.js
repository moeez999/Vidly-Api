const express = require("express");
const { User, validate } = require("../models/user");
const _ = require("lodash");
const bycrypt = require("bcrypt");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const user = await User.find().select("-password -__v");
  res.send(user);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -__v");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    let errors = "";
    for (let index = 0; index < error.details.length; index++) {
      errors = error.details[index].message + ", ";
    }
    return res.status(400).send(error);
  }
  try {
    var user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered");

    user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin"]));
    const salt = await bycrypt.genSalt(10);
    user.password = await bycrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
