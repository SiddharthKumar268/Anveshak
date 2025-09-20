const express = require("express");
const { registerUser, loginUser, verifyOtp } = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);       // Step 1: password check + send OTP
router.post("/verify-otp", verifyOtp);  // Step 2: verify OTP → get token

module.exports = router;
