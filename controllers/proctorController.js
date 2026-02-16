const AptitudeAttempt = require("../models/aptitudeTestAttempt.js");
const CodingAttempt = require("../models/CodingAttempt");
const ProctorLog = require("../models/ProctorLog");

exports.addViolation = async (req, res) => {
  try {
    const { attemptId, testType, violationType } = req.body;

    let attempt;

    if (testType === "aptitude") {
      attempt = await AptitudeAttempt.findById(attemptId);
    } else {
      attempt = await CodingAttempt.findById(attemptId);
    }

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    // Push inside attempt
    attempt.violations.push({ type: violationType });
    attempt.totalViolations += 1;

    await attempt.save();

    // Save separate log
    await ProctorLog.create({
      user: req.user.id,
      attemptId,
      testType,
      violationType
    });

    res.json({ message: "Violation saved" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
