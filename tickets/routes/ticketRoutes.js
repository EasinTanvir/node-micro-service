const express = require("express");
const Ticket = require("../models/Ticket");
const router = express.Router();
const protectRoute = require("../middlewares/protectRoute");
const natsWrapper = require("../nats-wrapper");
const Subjects = require("../events/publisher/subjects");
// Get all tickets of current user
router.get("/", protectRoute, async (req, res) => {
  try {
    const tickets = await Ticket.find({
      userId: req.user.id,
    });

    res.json({
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get single ticket
router.get("/:id", protectRoute, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.json({
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Create ticket
router.post("/create", protectRoute, async (req, res) => {
  try {
    const { title, price } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({
        message: "Title and Price are required",
      });
    }

    const ticket = await Ticket.create({
      title,
      price,
      userId: req.user.id,
    });

    natsWrapper.client.publish(
      Subjects.TICKET_CREATED,
      JSON.stringify({
        id: ticket._id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      }),
      () => {
        console.log("Ticket Created Event Published");
      },
    );

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

// Update ticket
router.put("/:id", protectRoute, async (req, res) => {
  try {
    const { title, price } = req.body;

    const ticket = await Ticket.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        title,
        price,
      },
      {
        new: true,
      },
    );

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.json({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Delete ticket
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
