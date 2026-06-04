const natsWrapper = require("../../nats-wrapper");
const Ticket = require("../../models/Ticket");

const Subjects = require("../publisher/subjects");
const QueueGroup = require("./queue-group");

class OrderCancelledListener {
  listen() {
    const options = natsWrapper.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setDurableName("order-cancelled-durable");

    const subscription = natsWrapper.client.subscribe(
      Subjects.ORDER_CANCELLED,
      QueueGroup.TICKET_SERVICE_QUEUE,
      options,
    );

    subscription.on("message", async (msg) => {
      try {
        const data = JSON.parse(msg.getData());

        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
          throw new Error(`Ticket ${data.ticket.id} not found`);
        }

        ticket.set({
          orderId: undefined,
        });

        await ticket.save();

        await natsWrapper.client.publish(
          Subjects.TICKET_UPDATED,
          JSON.stringify({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            orderId: ticket.orderId,
            version: ticket.version,
          }),
          () => {
            console.log("Ticket Updated Event Published");
          },
        );

        console.log(`[OrderCancelled] Released ticket ${ticket.id}`);

        msg.ack();
      } catch (err) {
        console.error(err);
      }
    });
  }
}

module.exports = OrderCancelledListener;
