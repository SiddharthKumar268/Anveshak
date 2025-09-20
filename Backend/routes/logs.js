// routes/logs.js
const express = require("express");
const router = express.Router();
const { addLog, getLogs } = require("../controllers/logsController");

router.post("/", addLog);
router.get("/", getLogs);

module.exports = router;
