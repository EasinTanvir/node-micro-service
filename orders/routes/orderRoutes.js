const express = require("express");
const Ticket = require("../models/Ticket");
const Order = require("../models/Order");
const router = express.Router();
const protectRoute = require("../middlewares/protectRoute");
const OrderCreatedPublisher = require("../events/publisher/order-created-publisher");
const OrderCancelledPublisher = require("../events/publisher/order-cancelled-publisher");
// Get all orders of current user
router.get("/", protectRoute, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    }).populate("ticket");

    res.json({
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get single order
router.get("/:id", protectRoute, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("ticket");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.userId !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized to view this order",
      });
    }

    res.json({
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Create order
router.post("/create", protectRoute, async (req, res) => {
  try {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    // check that ticket already reserved or not
    const existingOrder = await Order.findOne({
      ticket: ticket,
      status: {
        $in: ["created", "awaiting:payment", "complete"],
      },
    });

    if (existingOrder) {
      return res.status(400).json({
        message: "Ticket is already reserved",
      });
    }

    // expire after 15 minutes
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 15 * 60);

    const order = await Order.create({
      userId: req.user.id,
      status: "created",
      expiresAt: expiration,
      ticket,
    });

    new OrderCreatedPublisher().publish(order, ticket);

    res.status(201).json({
      message: "order created successfully",
      order,
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
    const order = await Order.findById(req.params.id).populate("ticket");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.userId !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized to cancel this order",
      });
    }

    order.status = "cancelled";
    await order.save();

    new OrderCancelledPublisher().publish(order);

    res.json({
      message: "Order cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
