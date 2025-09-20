// routes/blockchain.js
const express = require("express");
const router = express.Router();
const { getEvents } = require("../controllers/blockchainController");

router.get("/", getEvents);

module.exports = router;
