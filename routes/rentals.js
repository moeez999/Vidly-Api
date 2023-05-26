const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const express = require("express");
// const Fawn = require("fawn");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../middleware/auth");

// Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    let errors = "";
    for (let index = 0; index < error.details.length; index++) {
      errors = error.details[index].message + ", ";
    }
    return res.status(400).send(errors);
  }
  try {
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Movie is not valid");

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Customer is not valid");

    if (movie.numberInStock === 0)
      return res.status(400).send("Movie not available in stock");

    let rental = new Rental({
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        isGold: customer.isGold,
      },
    });

    rental = await rental.save();
    movie.numberInStock--;
    movie.save();

    // new Fawn.Task()
    //   .save("rentals", rental)
    //   .update(
    //     "movies",
    //     { _id: movie._id },
    //     {
    //       $inc: { numberInStock: -1 },
    //     }
    //   )
    //   .run();

    res.send(rental);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
