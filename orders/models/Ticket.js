const mongoose = require("mongoose");

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

ticketSchema.pre("save", function () {
  this.increment();
});

module.exports = mongoose.model("Ticket", ticketSchema);
