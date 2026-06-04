const natsWrapper = require("../../nats-wrapper");
const Ticket = require("../../models/Ticket");

const Subjects = require("../publisher/subjects");
const QueueGroup = require("./queue-group");

class OrderCreatedListener {
  listen() {
    const options = natsWrapper.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setDurableName("order-created-durable");

    const subscription = natsWrapper.client.subscribe(
      Subjects.ORDER_CREATED,
      QueueGroup.TICKET_SERVICE_QUEUE,
      options,
    );

    subscription.on("message", async (msg) => {
      try {
        const data = JSON.parse(msg.getData());

        console.log("[OrderCreated] Received Event from ticket service:", data);

        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
          throw new Error(`Ticket ${data.ticket.id} not found`);
        }

        ticket.set({
          orderId: data.id,
        });

        await ticket.save();

        await natsWrapper.client.publish(
          Subjects.TICKET_UPDATED,
          JSON.stringify({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version,
          }),
          () => {
            console.log("Ticket Updated Event Published");
          },
        );

        msg.ack();

        console.log(`[OrderCreated] Reserved Ticket ${ticket.id}`);
      } catch (err) {
        console.error("[OrderCreated] Error:", err);
      }
    });
  }
}

module.exports = OrderCreatedListener;
