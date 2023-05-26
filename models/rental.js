const mongoose = require("mongoose");
const Joi = require("joi");

const Rental = mongoose.model(
  "Rental",
  mongoose.Schema({
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minLength: 5,
          maxLength: 255,
        },
        dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
      }),
      required: true,
    },
    customer: {
      type: new mongoose.Schema({
        name: { type: String, required: true, minLength: 5, maxLength: 50 },
        phone: { type: String, default: false, minLength: 5, maxLength: 50 },
        isGold: { type: Boolean, required: true },
      }),
      required: true,
    },
    dateOut: { type: Date, required: true, default: Date.now },
    dateReturned: { type: Date },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

function validate(rental) {
  const schema = {
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required(),
  };
  return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validate;
