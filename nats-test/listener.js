const nats = require("node-nats-streaming");
const { randomBytes } = require("crypto");
// second argument is client id, it should be unique for each instance of listener or publisher.
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("order-service-durable");
  // this is durable subscription confirm that list of event that process
  // or not if not process yet it will continue when the service is online

  const subscription = stan.subscribe(
    "ticket:created",
    "order-service-queue-group",
    options,
  );

  subscription.on("message", (msg) => {
    console.log("Seq No:", msg.getSequence());
    console.log("Received Event:", msg.getData());
    msg.ack();
  });
});
