const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const ticketRoutes = require("./routes/ticketRoutes");
const natsWrapper = require("./nats-wrapper");

const OrderCancelledListener = require("./events/listners/order-cancelled-listener");
const OrderCreatedListener = require("./events/listners/order-created-listner");

const app = express();

const start = async () => {
  try {
    await natsWrapper.connect(
      process.env.CLUSTER_ID,
      process.env.CLIENT_ID,
      process.env.NATS_URL,
    );

    new OrderCancelledListener().listen();
    new OrderCreatedListener().listen();

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

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
