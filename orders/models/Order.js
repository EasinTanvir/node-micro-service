const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["created", "cancelled", "awaiting:payment", "complete"],
      default: "created",
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
