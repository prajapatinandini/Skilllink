const mongoose = require("mongoose");

const codingAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  questions: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "CodingQuestion" },
    language: String,
    code: String,
    passed: Number,
    total: Number
  }],

  score: Number,

  aiReview: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "CodingQuestion" },
    aiGeneratedProbability: Number,
    behaviorRisk: Number,
    riskLevel: String
  }],

  startedAt: Date,
  submittedAt: Date,

  flagged: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model("CodingAttempt", codingAttemptSchema);
