const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  level: { type: String, enum: ["easy","intermediate","hard"], required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
  marks: { type: Number, default: 1 },
  violations: [{
  type: String,
  time: Date
}],
violationCount: { type: Number, default: 0 },
flagged: { type: Boolean, default: false }

});

module.exports = mongoose.model("AptitudeQuestion", questionSchema);