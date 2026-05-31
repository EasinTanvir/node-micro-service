const express = require("express");
const morgan = require("morgan");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Auth Service Running");
});

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log("Auth Server running on port 3000");
});
