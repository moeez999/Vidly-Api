const express = require("express");
const { User } = require("../models/user");
const _ = require("lodash");
const bycrypt = require("bcrypt");
const router = express.Router();
const Joi = require("joi");

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
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bycrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();
    res.send(token);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

function validate(request) {
  const schema = {
    email: Joi.string().trim().min(5).max(255).email().required(),
    password: Joi.string().trim().min(5).max(1024).required(),
  };
  return Joi.validate(request, schema);
}

module.exports = router;
