const mongoose = require("mongoose");

const SourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, default: "custom" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Source", SourceSchema);
