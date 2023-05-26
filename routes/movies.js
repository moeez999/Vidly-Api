const express = require("express");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.get("/:movieId", async (req, res) => {
  try {
    const genre = await Movie.findById(req.params.movieId).select(
      "_id title dailyRentalRate numberInStock genre"
    );
    if (!genre) return res.status(404).send("No movie found with ID provided");
    res.send(genre);
  } catch (err) {
    if (!mongoose.isValidObjectId(req.params.movieId)) err = "Not valid id";
    console.log(err);
    res.status(400).send(err);
  }
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
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Genre id is not valid");

    const movie = new Movie({
      title: req.body.title,
      genre: { _id: genre._id, name: genre.name },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });
    const result = await movie.save();
    res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    let errors = "";
    for (let index = 0; index < error.details.length; index++) {
      errors = error.details[index].message + ", ";
    }
    return res.status(400).send(errors);
  }

  try {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Genre id is not valid");

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate,
          genre: { _id: genre._id, name: genre.name },
        },
      },
      { new: true, useFindAndModify: false }
    );

    if (!movie) return res.status(404).send("No movie found with ID provided");
    res.send(movie);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id, {
      useFindAndModify: false,
    });
    if (!movie) return res.status(404).send("No movie found with ID provided");
    res.send(movie);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = router;
