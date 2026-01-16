const express = require("express");
const router = express.Router();

const { completeProfile, getProfile, updateProfile } = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");


router.post("/complete", authMiddleware, upload.single("resume"), completeProfile);

router.get("/me", authMiddleware, getProfile);

router.put("/update", authMiddleware, upload.single("resume"), updateProfile);

module.exports = router;
