const AptitudeQuestion = require("../models/AptitudeQuestion");
const TestAttempt = require("../models/aptitudeTestAttempt");
const Project = require("../models/Project");
const User = require("../models/userModel");   
const AptitudeResult = require("../models/AptitudeResult");


const MAX_VIOLATIONS = 3;
const TEST_DURATION_MINUTES = 20;

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};



// ------------------- START TEST -------------------


exports.startTest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.techStack) {
      return res.status(400).json({ message: "Tech stack not set in profile" });
    }

    // 🔹 Convert techStack to clean array
    let techStacks = [];

    if (Array.isArray(user.techStack)) {
      techStacks = user.techStack.map(ts =>
        ts.toLowerCase().replace(/\s+/g, "")
      );
    } else if (typeof user.techStack === "string") {
      techStacks = [user.techStack.toLowerCase().replace(/\s+/g, "")];
    } else {
      return res.status(400).json({ message: "Invalid techStack format in profile" });
    }

    // 🔹 Fetch random questions from user's tech stacks
    const questions = await AptitudeQuestion.aggregate([
      { $match: { techStack: { $in: techStacks } } },  // ✅ FIXED
      { $sample: { size: 20 } }
    ]);

    if (questions.length < 10) {
      return res.status(400).json({ message: "Not enough questions available" });
    }

    // 🔹 Create test attempt
    const attempt = await TestAttempt.create({
      userId: user._id,
      techStack: techStacks,   // ✅ store tech used
      questions: questions.map(q => ({
        questionId: q._id,
        correctAnswer: q.answer
      }))
    });

    // 🔹 Hide answers from frontend
    const safeQuestions = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options
    }));

    res.json({
      message: "Test started",
      attemptId: attempt._id,
      questions: safeQuestions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// ------------------- SUBMIT TEST -------------------
exports.submitTest = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers = [], violations = 0 } = req.body;

    const attempt = await TestAttempt.findOne({
      _id: attemptId,
      userId: req.user.id
    });

    if (!attempt)
      return res.status(404).json({ message: "Attempt not found" });

    if (attempt.submittedAt)
      return res.status(400).json({ message: "Test already submitted" });

    // ⏰ Time check
    const minutesTaken = (new Date() - attempt.startedAt) / 60000;
    if (minutesTaken > 20) attempt.flagged = true;

    let correctCount = 0;

    attempt.questions.forEach(q => {
      const userAns = answers.find(
        a => a.questionId === q.questionId.toString()
      );

      if (userAns && userAns.selected === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentageScore = Math.round(
      (correctCount / attempt.questions.length) * 100
    );

    // 🔴 SAVE VIOLATIONS
    attempt.totalViolations = violations;

    if (violations >= MAX_VIOLATIONS) {
      attempt.flagged = true;
    }

    attempt.score = percentageScore;
    attempt.submittedAt = new Date();

    await attempt.save();

    // 🔥 Save result separately
    await AptitudeResult.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        score: percentageScore
      },
      { upsert: true, new: true }
    );

    res.json({
      message: "Test submitted",
      score: percentageScore,
      flagged: attempt.flagged
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
