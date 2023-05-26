const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minLength: 5,
    maxLength: 255,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 1024,
  },
  isAdmin: Boolean,
});
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
      email: this.email,
      name: this.name,
    },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().trim().min(5).max(50).required(),
    email: Joi.string().trim().min(5).max(255).email().required(),
    password: Joi.string().trim().min(5).max(1024).required(),
    isAdmin: Joi.boolean(),
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
