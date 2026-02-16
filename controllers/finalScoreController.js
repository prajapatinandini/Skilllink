const FinalScore = require("../models/FinalScore");
const AptitudeResult = require("../models/AptitudeResult");
const CodingResult = require("../models/CodingResult");
const Evaluation = require("../models/Evaluation");


// ✅ GENERATE FINAL SCORE
exports.generateFinalScore = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Get aptitude result
    const aptitude = await AptitudeResult.findOne({ userId });

    // 2️⃣ Get highest coding result
    const coding = await CodingResult
      .findOne({ userId })
      .sort({ percentage: -1 });

    // 3️⃣ Get project evaluation
    const project = await Evaluation.findOne({ userId });

    // 4️⃣ Check if all exist
    if (!aptitude) {
      return res.status(400).json({ message: "Aptitude test not completed" });
    }

    if (!coding) {
      return res.status(400).json({ message: "Coding test not completed" });
    }

    if (!project) {
      return res.status(400).json({ message: "Project evaluation not completed" });
    }

    if (project.finalScore === undefined || project.finalScore === null) {
      return res.status(400).json({ message: "Project final score missing" });
    }

    // 5️⃣ Calculate overall percentage
    const overall =
      (aptitude.score || 0) * 0.30 +
      (coding.percentage || coding.score || 0) * 0.40 +
      (project.finalScore || 0) * 0.30;

    const roundedOverall = Math.round(overall);

    // 6️⃣ Determine skill level
    let skillLevel = "Beginner";

    if (roundedOverall >= 85) skillLevel = "Expert";
    else if (roundedOverall >= 70) skillLevel = "Advanced";
    else if (roundedOverall >= 50) skillLevel = "Intermediate";

    // 7️⃣ Save / Update Final Score
    const finalScore = await FinalScore.findOneAndUpdate(
      { userId },
      {
        aptitudeScore: aptitude.score,
        codingScore: coding.percentage || coding.score,
        projectScore: project.finalScore,
        overallPercentage: roundedOverall,
        skillLevel,
        generatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: "Final score generated successfully",
      finalScore
    });

  } catch (err) {
    console.error("Generate Final Score Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



// ✅ GET MY FINAL SCORE (Dashboard)
exports.getMyFinalScore = async (req, res) => {
  try {
    const userId = req.user.id;

    const finalScore = await FinalScore.findOne({ userId });

    if (!finalScore) {
      return res.status(404).json({
        message: "Final score not generated yet"
      });
    }

    return res.status(200).json(finalScore);

  } catch (err) {
    console.error("Get Final Score Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
