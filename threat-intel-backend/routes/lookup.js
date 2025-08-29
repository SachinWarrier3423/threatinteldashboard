const express = require("express");
const lookupService = require("../services/lookupService.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { type, value } = req.body;

    if (!type || !value) {
      return res.status(400).json({ error: 'type and value required (type: ip|domain)' });
    }

    if (!["ip", "domain"].includes(type)) {
      return res.status(400).json({ error: 'type must be "ip" or "domain"' });
    }

    const result = await lookupService.lookup(type, value);
    res.json(result);
  } catch (err) {
    console.error("Lookup error:", err);
    res.status(500).json({ error: err.message || "server error" });
  }
});

module.exports = router;
