const express = require("express");
const { generateCommitKey, verifyCommitKey } = require("../controllers/keyCommitController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate", authMiddleware, generateCommitKey);
router.post("/verify", authMiddleware, verifyCommitKey);

module.exports = router;
