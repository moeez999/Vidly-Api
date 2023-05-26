const { Customer, validate } = require("../models/customer");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const customers = await Customer.find()
    .select("name phone isGold")
    .sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .select("name phone isGold")
      .sort("name");
    if (!customer)
      return res.status(404).send("No customer with given ID found");
    res.send(customer);
  } catch (err) {
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
    const { name, isGold, phone } = req.body;
    const customer = new Customer({ name, isGold, phone });
    const result = await customer.save();
    res.send(result);
  } catch (err) {
    console.log(err);
    res.send(err);
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
    const { name, isGold, phone } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: name,
          isGold: isGold,
          phone: phone,
        },
      },
      { new: true, useFindAndModify: false }
    );
    if (!customer)
      return res.status(404).send("No customer with given ID found");
    res.send(customer);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id, {
    new: true,
    useFindAndModify: false,
  });
  if (!customer) return res.status(404).send("No customer with given ID found");
  res.send(customer);
});

module.exports = router;
