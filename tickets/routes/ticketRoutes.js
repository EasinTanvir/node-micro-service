const express = require("express");

const router = express.Router();

router.get("/tickets", async (req, res) => {
  res.json({ message: "tickets connection success" });
});

module.exports = router;
