const natsWrapper = require("../../nats-wrapper");
const Subjects = require("./subjects");

class OrderCancelledPublisher {
  publish(order) {
    natsWrapper.client.publish(
      Subjects.ORDER_CANCELLED,
      JSON.stringify({
        id: order.id,
        ticket: {
          id: order.ticket.id,
        },
      }),
      () => {
        console.log("Order Cancelled Event Published");
      },
    );
  }
}

module.exports = OrderCancelledPublisher;
