const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, SECRET_KEY, { expiresIn: "7d" });
};

// -----------------------
// Registration
// -----------------------
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student"
    });

    res.json({
      message: "Registration successful",
      token: generateToken(user._id),
      userId: user._id,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------
// Login
// -----------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      userId: user._id,
      role: user.role,
      profileCompleted: user.profileCompleted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------
// Send OTP for Password Reset
// -----------------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + (process.env.OTP_EXPIRE_MINUTES || 10) * 60 * 1000;
    await user.save();

    await sendEmail(email, "Your Password Reset OTP", `Your OTP is: ${otp}`);

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------
// Verify OTP & Reset Password
// -----------------------
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    if (!user.otp || user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP Expired" });

    user.password = newPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------
// Firebase Login (email optional)
// -----------------------
exports.firebaseLogin = async (req, res) => {
  try {
    const { firebaseUID, email, name, role } = req.body;

    if (!firebaseUID) return res.status(400).json({ message: "firebaseUID is required" });

    let user = await User.findOne({ firebaseUID });

    if (!user) {
      user = await User.create({
        name,
        email: email || null, // email optional
        firebaseUID,
        role: role || "student"
      });
    }

    res.json({
      message: "Firebase Login Successful",
      token: generateToken(user._id),
      userId: user._id,
      role: user.role,
      profileCompleted: user.profileCompleted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
