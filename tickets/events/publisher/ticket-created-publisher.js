const natsWrapper = require("../../nats-wrapper");
const Subjects = require("./subjects");

class TicketCreatedPublisher {
  publish(ticket) {
    natsWrapper.client.publish(
      Subjects.TICKET_CREATED,
      JSON.stringify({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
      }),
      () => {
        console.log("Ticket Created Event Published");
      },
    );
  }
}

module.exports = TicketCreatedPublisher;
