const express = require("express");
const router = express.Router();
const { generateCommitKey, verifyCommitKey } = require("../controllers/keyCommitController");
const auth = require("../middleware/authMiddleware");

// ✅ Generate a commit key
router.post("/generate", auth, generateCommitKey);

// ✅ Verify commit key in README.md
router.post("/verify", auth, verifyCommitKey);

module.exports = router;
