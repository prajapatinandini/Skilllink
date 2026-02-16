const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
  marks: { type: Number, default: 1 },
  techStack: [
  {
    type: String,
    lowercase: true,
    trim: true
  }
],

  violations: [{
    type: String,
    time: Date
  }],
  violationCount: { type: Number, default: 0 },
  flagged: { type: Boolean, default: false }

});

module.exports = mongoose.model("AptitudeQuestion", questionSchema);