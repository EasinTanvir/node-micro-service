const natsWrapper = require("../../nats-wrapper");
const Subjects = require("./subjects");

class TicketUpdatedPublisher {
  publish(ticket) {
    natsWrapper.client.publish(
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
  }
}

module.exports = TicketUpdatedPublisher;
