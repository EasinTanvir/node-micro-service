const natsWrapper = require("../../nats-wrapper");
const Subjects = require("./subjects");

class OrderCreatedPublisher {
  publish(order, ticket) {
    natsWrapper.client.publish(
      Subjects.ORDER_CREATED,
      JSON.stringify({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
          id: ticket.id,
          price: ticket.price,
        },
      }),
      () => {
        console.log("Order Created Event Published");
      },
    );
  }
}

module.exports = OrderCreatedPublisher;
