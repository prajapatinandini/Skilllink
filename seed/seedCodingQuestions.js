const mongoose = require("mongoose");
const dotenv = require("dotenv");
const CodingQuestion = require("../models/CodingQuestion");
const questions = require("./codingQuestions");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  await CodingQuestion.deleteMany();
  await CodingQuestion.insertMany(questions);
  console.log("Coding Questions Seeded");
  process.exit();
});

