// middleware/checkCodingUnlocked.js
const UserProgress = require("../models/UserProgress");

module.exports = async (req, res, next) => {
  const progress = await UserProgress.findOne({ userId: req.user.id });

  if (!progress || !progress.codingUnlocked) {
    return res.status(403).json({
      message: "Complete aptitude test to unlock coding round 🔒"
    });
  }

  next();
};
