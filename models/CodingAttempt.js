const mongoose = require("mongoose");

const CodingAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tech: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "CodingQuestion" }],
  score: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
  violations: [
    {
      type: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  totalViolations: { type: Number, default: 0 },
  recordingUrl: String
});

module.exports = mongoose.model("CodingAttempt", CodingAttemptSchema); // ✅ model
