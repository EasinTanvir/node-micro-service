const mongoose = require("mongoose");
const { updateIfCurrentPlugin } = require("@etomon/mongoose-update-if-current");

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
orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);
module.exports = mongoose.model("Order", orderSchema);
