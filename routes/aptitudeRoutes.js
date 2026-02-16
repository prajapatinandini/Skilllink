const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const aptitudeController = require("../controllers/aptitudeController");
const UserProgress = require("../models/UserProgress");


/* =========================
   START TEST
========================= */
router.get("/start", auth, aptitudeController.startTest);


/* =========================
   SUBMIT TEST (by attemptId)
========================= */
router.post("/:attemptId", auth, aptitudeController.submitTest);


/* =========================
   REPORT VIOLATION
========================= */



/* =========================
   MARK APTITUDE COMPLETE
   (Unlock Coding Round)
========================= */
router.post("/complete", auth, async (req, res) => {
  try {
    let progress = await UserProgress.findOne({
      userId: req.user.id
    });

    if (!progress) {
      progress = new UserProgress({
        userId: req.user.id
      });
    }

    progress.aptitudeCompleted = true;
    progress.codingUnlocked = true;

    await progress.save();

    res.json({
      message: "Aptitude completed! Coding round unlocked 🚀"
    });

  } catch (err) {
    console.error("Complete aptitude error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
