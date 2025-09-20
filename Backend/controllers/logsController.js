    // controllers/logsController.js
    const Log = require("../models/Log");
    const Incident = require("../models/Incident");
    const { detectAnomaly } = require("../services/anomalyService");
    const { logToBlockchain } = require("../services/blockchainService");

    exports.addLog = async (req, res) => {
    try {
        const { message, metadata, level, source, user } = req.body;
        if (!message) {
        return res.status(400).json({ error: "message is required" });
        }

        const logDoc = new Log({
        message,
        metadata: metadata || {},
        level: level || "info",
        source: source || "simulator",
        user: user || "unknown"
        });

        await logDoc.save();

        // Write audit to blockchain (non-fatal if it fails)
        try {
        // Keep the blockchain record short: type + id + user + level
        const short = `ADD:${logDoc._id.toString()}:${logDoc.user}:${logDoc.level}`;
        const txHash = await logToBlockchain(short);
        if (txHash) console.log("Blockchain tx:", txHash);
        } catch (err) {
        console.warn("Blockchain log failed (continuing):", err.message || err);
        }

        // Run anomaly detection (non-fatal)
        try {
        const result = await detectAnomaly({ message: logDoc.message, metadata: logDoc.metadata });
        if (result && result.anomaly) {
            const incident = new Incident({
            description: logDoc.message,
            sourceLogId: logDoc._id,
            severity: result.severity || "medium"
            });
            await incident.save();
        }
        } catch (err) {
        console.error("Anomaly detection error (continuing):", err.message || err);
        }

        return res.status(201).json(logDoc);
    } catch (err) {
        console.error("addLog error:", err);
        return res.status(500).json({ error: "Server error" });
    }
    };

    exports.getLogs = async (req, res) => {
    try {
        // limit and sort for demo convenience
        const logs = await Log.find().sort({ createdAt: -1 }).limit(500).lean();

        // Record read to blockchain (attempt; non-fatal)
        try {
        const short = `READ:logs:${req.ip || "unknown"}`;
        await logToBlockchain(short);
        } catch (err) {
        console.warn("Blockchain read log failed:", err.message || err);
        }

        return res.json(logs);
    } catch (err) {
        console.error("getLogs error:", err);
        return res.status(500).json({ error: "Server error" });
    }
    };
