const mongoose = require("mongoose");

const FinalScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true
  },
  aptitudeScore: Number,
  codingScore: Number,
  projectScore: Number,
  overallPercentage: Number,
  skillLevel: String,
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("FinalScore", FinalScoreSchema);
