const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/aysnc");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.find().select("_id name");
    res.send(genre);
  })
);

router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findById(req.params.id).select("_id name");
    if (!genre) return res.status(404).send("No genre found with ID provided");
    res.send(genre);
  })
);

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
    let genre = new Genre({
      name: req.body.name,
    });

    genre = await genre.save();
    res.send(genre);
  } catch (err) {
    let error = "";
    for (const field in err.errors) {
      error = err.errors[field].message + ",";
    }
    res.status(400).send(error);
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
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
        },
      },
      { new: true, useFindAndModify: false }
    );

    if (!genre) return res.status(404).send("No genre found with ID provided");
    res.send(genre);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id, {
      useFindAndModify: false,
    });
    if (!genre) return res.status(404).send("No genre found with ID provided");
    res.send(genre);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = router;
