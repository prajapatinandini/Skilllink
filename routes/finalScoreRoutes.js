

const express = require("express");
const router = express.Router();
const finalScoreController = require("../controllers/finalScoreController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/generate",
  authMiddleware,
  finalScoreController.generateFinalScore
);

router.get(
  "/my-score",
  authMiddleware,
  finalScoreController.getMyFinalScore
);

module.exports = router;
