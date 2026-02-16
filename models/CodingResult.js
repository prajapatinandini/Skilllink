const mongoose = require("mongoose");

const CodingResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  attemptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CodingAttempt"
  },
  score: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    default: 100
  },
  percentage: {
    type: Number
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CodingResult", CodingResultSchema);
