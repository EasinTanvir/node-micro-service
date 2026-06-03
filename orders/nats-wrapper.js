const nats = require("node-nats-streaming");

class NatsWrapper {
  constructor() {
    this._client = null;
  }

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }

    return this._client;
  }

  connect(clusterId, clientId, url) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this._client.on("connect", () => {
        console.log("Connected to NATS New");
        resolve();
      });

      this._client.on("error", (err) => {
        console.error("Error connecting to NATS:", err);
        reject(err);
      });
    });
  }
}

module.exports = new NatsWrapper();
