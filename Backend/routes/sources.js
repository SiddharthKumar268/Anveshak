const express = require("express");
const router = express.Router();
const Source = require("../models/Source");
const authMiddleware = require("../middleware/auth");

// Add new source
router.post("/", authMiddleware, async (req, res) => {
  try {
    const src = new Source(req.body);
    await src.save();
    res.json(src);
  } catch (err) {
    res.status(400).json({ message: "Error saving source", error: err.message });
  }
});

// Get all sources
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sources = await Source.find().sort({ createdAt: -1 });
    res.json(sources);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sources" });
  }
});

module.exports = router;
