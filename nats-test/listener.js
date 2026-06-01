const nats = require("node-nats-streaming");
const { randomBytes } = require("crypto");
// second argument is client id, it should be unique for each instance of listener or publisher.
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  const subscription = stan.subscribe(
    "ticket:created",
    "order-service-queue-group",
  );

  subscription.on("message", (msg) => {
    console.log("Received Event:", msg.getData());
  });
});
