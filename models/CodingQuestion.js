const mongoose = require("mongoose");

const CodingQuestionSchema = new mongoose.Schema({
  techStack: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ["easy", "hard"],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  testCases: [
    {
      input: String,
      expectedOutput: String
    }
  ]
});

module.exports = mongoose.model("CodingQuestion", CodingQuestionSchema);
