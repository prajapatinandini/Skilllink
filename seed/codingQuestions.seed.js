const mongoose = require("mongoose");
const CodingQuestion = require("../models/CodingQuestion");

const questions = [

/* ===================== JAVASCRIPT ===================== */

{
  techStack: "javascript",
  difficulty: "easy",
  title: "Reverse a String",
  description: "Reverse the given string.",
  testCases: [{ input: "hello", expectedOutput: "olleh" }]
},
{
  techStack: "javascript",
  difficulty: "easy",
  title: "Count Vowels",
  description: "Count number of vowels in a string.",
  testCases: [{ input: "skilllink", expectedOutput: "3" }]
},
{
  techStack: "javascript",
  difficulty: "hard",
  title: "Valid Parentheses",
  description: "Check if parentheses are valid.",
  testCases: [{ input: "()[]{}", expectedOutput: "true" }]
},
{
  techStack: "javascript",
  difficulty: "hard",
  title: "Array Rotation",
  description: "Rotate array by k positions.",
  testCases: [{ input: "1,2,3,4,5|2", expectedOutput: "3,4,5,1,2" }]
},

/* ===================== PYTHON ===================== */

{
  techStack: "python",
  difficulty: "easy",
  title: "Sum of List",
  description: "Return sum of all numbers.",
  testCases: [{ input: "1,2,3,4", expectedOutput: "10" }]
},
{
  techStack: "python",
  difficulty: "easy",
  title: "Palindrome Check",
  description: "Check if string is palindrome.",
  testCases: [{ input: "madam", expectedOutput: "true" }]
},
{
  techStack: "python",
  difficulty: "hard",
  title: "Longest Word",
  description: "Return longest word in sentence.",
  testCases: [{ input: "I love programming", expectedOutput: "programming" }]
},
{
  techStack: "python",
  difficulty: "hard",
  title: "Frequency Counter",
  description: "Return frequency of characters.",
  testCases: [{ input: "aab", expectedOutput: "{a:2,b:1}" }]
},

/* ===================== JAVA ===================== */

{
  techStack: "java",
  difficulty: "easy",
  title: "Find Max Element",
  description: "Find max element in array.",
  testCases: [{ input: "1,4,2,9", expectedOutput: "9" }]
},
{
  techStack: "java",
  difficulty: "easy",
  title: "String Length",
  description: "Return length of string.",
  testCases: [{ input: "SkillLink", expectedOutput: "9" }]
},
{
  techStack: "java",
  difficulty: "hard",
  title: "Second Largest Element",
  description: "Find second largest element.",
  testCases: [{ input: "10,5,8,20", expectedOutput: "10" }]
},
{
  techStack: "java",
  difficulty: "hard",
  title: "Balanced Brackets",
  description: "Check if brackets are balanced.",
  testCases: [{ input: "{[()]}", expectedOutput: "true" }]
},

/* ===================== NODEJS ===================== */

{
  techStack: "nodejs",
  difficulty: "easy",
  title: "Simple REST API",
  description: "Create GET API returning JSON.",
  testCases: [{ input: "GET /users", expectedOutput: "200 OK" }]
},
{
  techStack: "nodejs",
  difficulty: "hard",
  title: "Async Order Execution",
  description: "Handle async tasks in sequence.",
  testCases: [{ input: "task1,task2", expectedOutput: "task1->task2" }]
},

/* ===================== SQL ===================== */

{
  techStack: "sql",
  difficulty: "easy",
  title: "Select All Records",
  description: "Fetch all records from table.",
  testCases: [{ input: "SELECT * FROM users", expectedOutput: "rows" }]
},
{
  techStack: "sql",
  difficulty: "hard",
  title: "Second Highest Salary",
  description: "Find second highest salary.",
  testCases: [{ input: "employee table", expectedOutput: "salary" }]
},

/* ===================== REACT ===================== */

{
  techStack: "react",
  difficulty: "easy",
  title: "Functional Component",
  description: "Create functional component displaying text.",
  testCases: [{ input: "Hello", expectedOutput: "Rendered" }]
},
{
  techStack: "react",
  difficulty: "hard",
  title: "useEffect Cleanup",
  description: "Implement cleanup in useEffect.",
  testCases: [{ input: "component unmount", expectedOutput: "cleanup executed" }]
},

/* ===================== C++ ===================== */

{
  techStack: "cplusplus",
  difficulty: "easy",
  title: "Swap Two Numbers",
  description: "Swap numbers using temp variable.",
  testCases: [{ input: "2 3", expectedOutput: "3 2" }]
},
{
  techStack: "cplusplus",
  difficulty: "hard",
  title: "Binary Search",
  description: "Implement binary search.",
  testCases: [{ input: "1 2 3 4 5 | 4", expectedOutput: "index 3" }]
}

];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    await CodingQuestion.deleteMany();
    await CodingQuestion.insertMany(questions);

    console.log("✅ Coding Question Bank Seeded Successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();