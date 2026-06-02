const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const ticketRoutes = require("./routes/ticketRoutes");
const natsWrapper = require("./nats-wrapper");

const app = express();

const start = async () => {
  try {
    await natsWrapper.connect(
      "ticketing",
      "ticket-service-new",
      "http://nats-service:4222",
    );

    await connectDB();

    app.use(express.json());
    app.use(cookieParser());
    app.use(morgan("dev"));

    app.use("/api/tickets", ticketRoutes);

    app.listen(3000, () => {
      console.log("Ticket Server running on port 3000");
    });
  } catch (err) {
    console.error(err);
  }
};

start();
