const mongoose = require("mongoose");
const { updateIfCurrentPlugin } = require("@etomon/mongoose-update-if-current");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

module.exports = mongoose.model("Ticket", ticketSchema);
