const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.send("Server is running on port 3000");
});
app.get("/api/auth/user/all", (req, res) => {
  res.send("all users");
});

app.get("/about", (req, res) => {
  res.send("About page");
});

// Start server
app.listen(3000, () => {
  console.log("Auth Server running at http://localhost:3000");
});
