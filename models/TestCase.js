const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "CodingQuestion" },
  input: String,
  output: String
});

module.exports = mongoose.model("TestCase", testCaseSchema);
