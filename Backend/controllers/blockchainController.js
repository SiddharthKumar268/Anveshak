// controllers/blockchainController.js
const { getBlockchainEvents } = require("../services/blockchainService");

exports.getEvents = async (req, res) => {
  try {
    const events = await getBlockchainEvents();
    return res.json(events);
  } catch (err) {
    console.error("getEvents error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
