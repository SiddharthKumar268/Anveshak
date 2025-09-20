const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  description: { type: String, required: true },
  sourceLogId: { type: mongoose.Schema.Types.ObjectId, ref: "Log", default: null },
  severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  acknowledged: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Incident", incidentSchema);
