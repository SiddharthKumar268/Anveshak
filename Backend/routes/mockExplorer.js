// routes/mockExplorer.js
const express = require("express");
const router = express.Router();
const { getTx } = require("../services/mockBlockchainService");

// Simple JSON explorer endpoint — looks like a real tx page
router.get("/tx/:txHash", async (req, res) => {
  try {
    const tx = await getTx(req.params.txHash);
    if (!tx) return res.status(404).json({ error: "tx not found" });

    // A pretty JSON response that resembles a block explorer payload
    return res.json({
      txHash: tx.txHash,
      from: tx.from,
      blockNumber: tx.blockNumber,
      timestamp: tx.timestamp,
      confirmations: tx.confirmations,
      logInfo: tx.logInfo,
      explorerLink: `${req.protocol}://${req.get("host")}/explorer/tx/${tx.txHash}`
    });
  } catch (err) {
    console.error("explorer tx error:", err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
