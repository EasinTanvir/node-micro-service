const natsWrapper = require("../../nats-wrapper");
const Ticket = require("../../models/Ticket");

const Subjects = require("../publisher/subjects");
const QueueGroup = require("../listners/queue-group");

class TicketUpdatedListener {
  listen() {
    const options = natsWrapper.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setDurableName("ticket-updated-durable");

    const subscription = natsWrapper.client.subscribe(
      Subjects.TICKET_UPDATED,
      QueueGroup.ORDER_SERVICE_QUEUE,
      options,
    );

    subscription.on("message", async (msg) => {
      try {
        const data = JSON.parse(msg.getData());

        console.log("[TicketUpdated] Received event:", data);

        // concurrency control
        const ticket = await Ticket.findOne({
          _id: data.id,
          version: data.version - 1,
        });

        if (!ticket) {
          throw new Error(`Ticket ${data.id} not found`);
        }

        ticket.set({
          title: data.title,
          price: data.price,
        });

        await ticket.save();

        msg.ack();

        console.log(`[TicketUpdated] Ticket ${data.id} updated`);
      } catch (err) {
        console.error("[TicketUpdated] Error processing event:", err);
      }
    });
  }
}

module.exports = TicketUpdatedListener;
