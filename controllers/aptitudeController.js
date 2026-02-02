const AptitudeQuestion = require("../models/AptitudeQuestion");
const TestAttempt = require("../models/TestAttempt");

const MAX_VIOLATIONS = 3; 


exports.startTest = async (req, res) => {
  try {
    const questionsPerLevel = { Easy: 7, Intermediate: 7, Hard: 6 };
    let allQuestions = [];

    for (const [level, count] of Object.entries(questionsPerLevel)) {
      const questions = await AptitudeQuestion.aggregate([
        { $match: { level } },
        { $sample: { size: count } }
      ]);

      allQuestions.push(...questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: [...q.options].sort(() => Math.random() - 0.5)
      })));
    }

    allQuestions.sort(() => Math.random() - 0.5);

    const attempt = await TestAttempt.create({
      userId: req.user.id,
      level: "mixed",
      questions: allQuestions.map(q => ({ questionId: q._id })),
      startedAt: new Date(),
      violations: [],
      violationCount: 0,
      flagged: false
    });

    res.json({
      attemptId: attempt._id,
      questions: allQuestions,
      duration: 20
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.submitTest = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;

    const attempt = await TestAttempt.findOne({
      _id: attemptId,
      userId: req.user.id
    }).populate("questions.questionId");

    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    
    const minutes = (new Date() - attempt.startedAt) / 60000;
    if (minutes > 20) attempt.flagged = true;

    let totalScore = 0;
    let maxScore = 0;

    attempt.questions.forEach(q => {
      const correct = q.questionId.answer;
      const marks = q.questionId.marks || 1;
      maxScore += marks;

      const userAns = answers.find(a => a.questionId === q.questionId._id.toString());
      const isCorrect = userAns && userAns.selected === correct;

      q.selected = userAns?.selected || null;
      q.score = isCorrect ? marks : 0;
      if (isCorrect) totalScore += marks;
    });

    attempt.score = totalScore;
    attempt.submittedAt = new Date();

    await attempt.save();

    res.json({
      message: "Test submitted",
      score: totalScore,
      maxScore,
      flagged: attempt.flagged,
      violations: attempt.violations
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.reportViolation = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { type } = req.body; 

    const attempt = await TestAttempt.findOne({
      _id: attemptId,
      userId: req.user.id
    });

    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    attempt.violations.push({
      type,
      time: new Date()
    });

    attempt.violationCount += 1;

    if (attempt.violationCount >= MAX_VIOLATIONS) {
      attempt.flagged = true;
    }

    await attempt.save();

    res.json({
      message: "Violation recorded",
      totalViolations: attempt.violationCount,
      flagged: attempt.flagged
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
