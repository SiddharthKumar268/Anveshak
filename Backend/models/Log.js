const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  message: { type: String, required: true },
  metadata: { type: Object, default: {} },
  level: { type: String, default: "info" },
  source: { type: String, default: "simulator" },
  user: { type: String, default: "unknown" },
}, { timestamps: true });

module.exports = mongoose.model("Log", logSchema);
