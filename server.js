require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./utils/db");

// Routes
const authRoutes = require("./routes/auth");
const logsRoutes = require("./routes/logs");
const incidentsRoutes = require("./routes/incidents");
const blockchainRoutes = require("./routes/blockchain");
const Source = require("./models/Source"); // For sources
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Test route
app.get("/api/test", (req, res) => res.send("Server is running!"));
app.use(express.static(path.join(__dirname, "..", "Frontend_1")));

// Serve assets folder at /assets URL
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));

// /login route
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Frontend_1", "login.html"));
});
// Connect to MongoDB
connectDB();

// Routes
app.use("/api/logs", logsRoutes);
app.use("/api/incidents", incidentsRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/auth", authRoutes);


// ------------------------------
// Sources Routes
// ------------------------------
app.post("/api/sources", async (req, res) => {
  try {
    const { name, url, type } = req.body;
    if (!name || !url || !type) {
      return res.status(400).json({ message: "Name, URL and type are required" });
    }

    const newSource = new Source({ name, url, type });
    await newSource.save();

    res.status(201).json({ message: "Source added successfully", source: newSource });
  } catch (err) {
    console.error("Error saving source:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/sources", async (req, res) => {
  try {
    const sources = await Source.find().sort({ createdAt: -1 });
    res.json(sources);
  } catch (err) {
    console.error("Error fetching sources:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`🌐 Open your browser at: http://localhost:${PORT}/login`);
});
