const mongoose = require("mongoose");

const proctorLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  attemptId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  testType: {
    type: String,
    enum: ["aptitude", "coding"],
    required: true
  },

  violationType: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ProctorLog", proctorLogSchema);
