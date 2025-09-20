const express = require("express");
const router = express.Router();
const { getIncidents, addIncident } = require("../controllers/incidentsController");

// GET all incidents
router.get("/", getIncidents);

// POST a new incident
router.post("/add", addIncident);

module.exports = router;
