const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ---- Register ----
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---- Login (Step 1: Send OTP) ----
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 1 * 60 * 1000; // 1 minute
    await user.save();

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 1 minute.`,
    });

    res.json({ message: "OTP sent to email. Please verify." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---- Verify OTP (Step 2: Get JWT) ----
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.otp || user.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    if (Date.now() > user.otpExpiry)
      return res.status(400).json({ error: "OTP expired" });

    // OTP valid → issue JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "supersecret", { expiresIn: "1h" });

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
