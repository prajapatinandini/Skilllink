const express = require("express");
const router = express.Router();

const {
  completeProfile,
  getProfile,
  updateProfile
} = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ================= COMPLETE PROFILE =================
router.post(
  "/complete",
  authMiddleware,
  upload.single("resume"),
  completeProfile
);

// ================= GET LOGGED IN USER PROFILE =================
router.get(
  "/me",
  authMiddleware,
  getProfile
);

// ================= UPDATE PROFILE =================
router.put(
  "/update",
  authMiddleware,
  upload.single("resume"),
  updateProfile
);

module.exports = router;
