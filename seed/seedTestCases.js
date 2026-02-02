const mongoose = require("mongoose");
const dotenv = require("dotenv");
const CodingQuestion = require("../models/CodingQuestion");
const TestCase = require("../models/TestCase");
const testData = require("./testCases");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log("DB Connected for TestCases");

  await TestCase.deleteMany();

  for (let q of testData) {
    const question = await CodingQuestion.findOne({ title: q.questionTitle });

    if (!question) {
      console.log("Question not found:", q.questionTitle);
      continue;
    }

    const casesToInsert = q.cases.map(c => ({
      questionId: question._id,
      input: c.input,
      output: c.output
    }));

    await TestCase.insertMany(casesToInsert);
    console.log("TestCases added for:", q.questionTitle);
  }

  console.log("All TestCases Seeded Successfully 🚀");
  process.exit();
})
.catch(err => console.log(err));
