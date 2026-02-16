const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "AptitudeQuestion" },
  correctAnswer: String
});

const violationSchema = new mongoose.Schema({
  type: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const testAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  techStack: [
    {
      type: String,
      lowercase: true,
      trim: true
    }
  ],

  questions: [answerSchema],

  score: { type: Number, default: 0 },

  startedAt: { type: Date, default: Date.now },

  submittedAt: Date,

  flagged: { type: Boolean, default: false },

  violations: {
    type: [violationSchema],
    default: []
  },

  totalViolations: {
    type: Number,
    default: 0
  },

  recordingUrl: String
});

module.exports = mongoose.model("aptitudeTestAttempt", testAttemptSchema);
