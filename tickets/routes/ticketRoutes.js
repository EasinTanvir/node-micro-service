const express = require("express");
const Ticket = require("../models/Ticket");
const router = express.Router();
const protectRoute = require("../middlewares/protectRoute");

router.get("/all", async (req, res) => {
  res.json({ message: "tickets connection success" });
});

router.post("/create", protectRoute, async (req, res) => {
  try {
    const { title, price } = req.body;

    if (!title || !price) {
      return res.status(400).json({
        message: "Title and Price are required",
      });
    }

    const ticket = await Ticket.create({
      title,
      price,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
module.exports = router;
