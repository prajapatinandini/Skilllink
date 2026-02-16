const CodingAttempt = require("../models/CodingAttempt");
const CodingQuestion = require("../models/CodingQuestion");
const CodingResult = require("../models/CodingResult");

exports.startCodingRound = async (req, res) => {
  try {
    const { tech } = req.params;

    const easyQ = await CodingQuestion.findOne({ techStack: tech, difficulty: "easy" });
    const hardQ = await CodingQuestion.findOne({ techStack: tech, difficulty: "hard" });

    if (!easyQ || !hardQ) return res.status(400).json({ message: "Questions not found" });

    const attempt = await CodingAttempt.create({
      userId: req.user.id,
      tech,
      questions: [easyQ._id, hardQ._id]
    });

    res.json({
      attemptId: attempt._id,
      questions: [easyQ, hardQ]
    });

  } catch (err) {
    console.error("Start Coding Round Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




exports.submitCodingTest = async (req, res) => {
  try {
    const { attemptId, answers } = req.body;

    if (!answers || !Array.isArray(answers))
      return res.status(400).json({ message: "Answers are required" });

    const attempt = await CodingAttempt.findOne({
      _id: attemptId,
      userId: req.user.id
    });

    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    if (attempt.completedAt) return res.status(400).json({ message: "Already submitted" });

    /* Score Calculation */
    let score = 0;
    answers.forEach(a => {
      if (a.answer && a.answer.length > 10) score += 50;
    });

    const totalMarks = answers.length * 50;
    const percentage = Math.round((score / totalMarks) * 100);

    /* Flag system */
    const totalViolations = attempt.totalViolations || 0;
    const isFlagged = totalViolations >= 5;

    attempt.score = score;
    attempt.completedAt = new Date();

    await attempt.save();

    res.json({
      message: "Coding test evaluated",
      score,
      percentage,
      totalViolations,
      isFlagged
    });

  } catch (err) {
    console.error("Submit Coding Test Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
