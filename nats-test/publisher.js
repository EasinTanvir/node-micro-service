const nats = require("node-nats-streaming");
const { randomBytes } = require("crypto");

const stan = nats.connect("ticketing", "publisher-123", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    id: randomBytes(4).toString("hex"),
    title: "React Course",
    price: 100,
  });

  stan.publish("ticket:created", data, () => {
    console.log("Event published");
  });
});
