const AptitudeQuestion = require("../models/AptitudeQuestion");
const TestAttempt = require("../models/TestAttempt");

exports.submitTest = async (req, res) => {
  try {
    const { attemptId, answers } = req.body;

    const attempt = await TestAttempt.findById(attemptId);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    let score = 0;
    let totalMarks = 0;
    let resultDetails = [];

    for (let ans of answers) {
      const question = await AptitudeQuestion.findById(ans.questionId);
      if (!question) continue;

      totalMarks += question.marks;

      const isCorrect = question.answer === ans.selectedOption;
      if (isCorrect) score += question.marks;

      resultDetails.push({
        question: question.question,
        correctAnswer: question.answer,
        selectedAnswer: ans.selectedOption,
        isCorrect
      });
    }

    attempt.score = score;
    attempt.totalMarks = totalMarks;
    attempt.completed = true;
    await attempt.save();

    res.json({
      message: "Test submitted successfully",
      score,
      totalMarks,
      percentage: ((score / totalMarks) * 100).toFixed(2),
      resultDetails
    });

  } catch (err) {
    res.status(500).json({ message: "Error submitting test", error: err.message });
  }
};
