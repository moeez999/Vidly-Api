const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model(
  "Customer",
  mongoose.Schema({
    name: { type: String, required: true, minLength: 5, maxLength: 50 },
    phone: { type: String, required: true, minLength: 5, maxLength: 50 },
    isGold: { type: Boolean, required: true },
  })
);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean().required(),
    phone: Joi.string().min(5).max(50).required(),
  };
  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
