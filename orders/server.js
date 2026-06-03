const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const natsWrapper = require("./nats-wrapper");
const TicketCreatedListener = require("./events/listners/ticket-created-listener");
const TicketUpdatedListener = require("./events/listners/ticket-updated-listener");

const app = express();

const start = async () => {
  try {
    await natsWrapper.connect(
      process.env.CLUSTER_ID,
      process.env.CLIENT_ID,
      process.env.NATS_URL,
    );

    new TicketCreatedListener().listen();
    new TicketUpdatedListener().listen();

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

    app.use("/api/orders/test", (req, res) => {
      res.send("Hello from the test endpoint!");
    });

    app.use("/api/orders", orderRoutes);

    app.listen(3000, () => {
      console.log("Order Server running on port 3000");
    });
  } catch (err) {
    console.error(err);
  }
};

start();
