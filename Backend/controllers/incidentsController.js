
const mongoose = require("mongoose");
const Incident = require("../models/Incident");

exports.getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 }).limit(500).lean();
    return res.json(incidents);
  } catch (err) {
    console.error("getIncidents error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.addIncident = async (req, res) => {
  try {
    let { description, severity, acknowledged, sourceLogId } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    // Validate sourceLogId
    if (!mongoose.Types.ObjectId.isValid(sourceLogId)) {
      sourceLogId = null;
    }

    const incident = new Incident({
      description,
      severity: severity || "low",
      acknowledged: !!acknowledged,
      sourceLogId
    });

    await incident.save();
    return res.status(201).json({ message: "Incident added successfully", incident });
  } catch (err) {
    console.error("addIncident error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
