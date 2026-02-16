const mongoose = require("mongoose");
const dotenv = require("dotenv");
const AptitudeQuestion = require("../models/AptitudeQuestion");
const questions = require("./seedaptitudeMCQs"); // your MCQ array file

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("DB Connected for Aptitude Questions");

    await AptitudeQuestion.deleteMany();

    const formattedQuestions = questions.map(q => ({
      question: q.question,
      options: q.options,
      answer: q.answer,          // must match exactly one option text
      marks: q.marks || 1,
      techStack: q.techStack.toLowerCase()
    }));

    await AptitudeQuestion.insertMany(formattedQuestions);

    console.log(" Aptitude Questions Seeded Successfully 🚀");
    process.exit();
  })
  .catch(err => console.log(err));
