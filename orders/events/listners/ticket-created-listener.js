const natsWrapper = require("../../nats-wrapper");
const Ticket = require("../../models/Ticket");

const Subjects = require("../../events/publisher/subjects");
const QueueGroup = require("../../events/listners/queue-group");

class TicketCreatedListener {
  listen() {
    const options = natsWrapper.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setDurableName("order-service-durable");

    // if we don't define queue group "order-service-queue-group"
    // if we have multiple instance it will create two copy
    const subscription = natsWrapper.client.subscribe(
      Subjects.TICKET_CREATED,
      QueueGroup.ORDER_SERVICE_QUEUE,
      options,
    );

    subscription.on("message", async (msg) => {
      try {
        const data = JSON.parse(msg.getData());

        console.log("Received Ticket Created Event:", data);

        await Ticket.create({
          _id: data.id,
          title: data.title,
          price: data.price,
        });

        msg.ack();

        console.log("Ticket saved to Orders Service");
      } catch (err) {
        console.error(err);
      }
    });
  }
}

module.exports = TicketCreatedListener;
