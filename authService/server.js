const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();

app.use(morgan("dev"));

mongoose
  .connect("mongodb://mongo-service:27017/auth")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

// Routes

app.get("/", (req, res) => {
  res.send("Server is running on port 3000");
});

app.get("/api/auth/user/all", (req, res) => {
  res.send("all users");
});

// Start server
app.listen(3000, () => {
  console.log("Auth Server running at http://localhost:3000");
});
