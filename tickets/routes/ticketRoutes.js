const express = require("express");

const router = express.Router();

router.get("/all", async (req, res) => {
  res.json({ message: "tickets connection success" });
});

module.exports = router;
