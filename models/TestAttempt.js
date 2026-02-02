const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "AptitudeQuestion" },
  selected: String,
  score: { type: Number, default: 0 },
});

const testAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  level: { type: String, enum: ["easy","intermediate","hard","mixed"], required: true },
  questions: [answerSchema],
  score: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  submittedAt: Date,
  flagged: { type: Boolean, default: false },
});

module.exports = mongoose.model("TestAttempt", testAttemptSchema);
