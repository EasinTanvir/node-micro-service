const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://mongo-service:27017/ticket");

    console.log("MongoDB Connected for tickets");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
