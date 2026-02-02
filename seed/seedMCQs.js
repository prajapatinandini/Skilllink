const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const AptitudeQuestion = require("../models/AptitudeQuestion");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));



const questions = [
  {"question":"Easy: What is 7 + 8?","level":"easy","options":["14","15","16","13"],"answer":"15","marks":1},
  {"question":"Easy: Find the next number: 1, 2, 3, ?","level":"easy","options":["4","5","6","3"],"answer":"4","marks":1},
  {"question":"Easy: Which data structure is FIFO?","level":"easy","options":["Stack","Queue","Tree","Graph"],"answer":"Queue","marks":1},
  {"question":"Easy: 5 * 6 = ?","level":"easy","options":["11","30","25","35"],"answer":"30","marks":1},
  {"question":"Easy: What is 15 - 9?","level":"easy","options":["5","6","7","4"],"answer":"6","marks":1},
  {"question":"Easy: Which of these is a programming language?","level":"easy","options":["Python","Snake","Lion","Elephant"],"answer":"Python","marks":1},
  {"question":"Easy: 12 / 4 = ?","level":"easy","options":["2","3","4","6"],"answer":"3","marks":1},
  {"question":"Easy: Which is used for LIFO?","level":"easy","options":["Queue","Stack","Array","Graph"],"answer":"Stack","marks":1},
  {"question":"Easy: 10 + 15 = ?","level":"easy","options":["25","24","26","23"],"answer":"25","marks":1},
  {"question":"Easy: What is 2 * 8?","level":"easy","options":["14","16","18","12"],"answer":"16","marks":1},
  {"question":"Easy: Next number: 2,4,6,8, ?","level":"easy","options":["10","9","12","11"],"answer":"10","marks":1},
  {"question":"Easy: 20 - 7 = ?","level":"easy","options":["12","13","14","15"],"answer":"13","marks":1},
  {"question":"Easy: Which is a relational database?","level":"easy","options":["MongoDB","MySQL","Cassandra","Neo4j"],"answer":"MySQL","marks":1},
  {"question":"Easy: 5 + 9 = ?","level":"easy","options":["12","14","13","15"],"answer":"14","marks":1},
  {"question":"Easy: 18 / 3 = ?","level":"easy","options":["6","5","7","4"],"answer":"6","marks":1},
  {"question":"Easy: Which symbol is used for assignment in most languages?","level":"easy","options":["==","=","!=","+="],"answer":"=","marks":1},
  {"question":"Easy: 3 * 7 = ?","level":"easy","options":["20","21","24","19"],"answer":"21","marks":1},
  {"question":"Easy: Find the next number: 1,3,5, ?","level":"easy","options":["6","7","8","9"],"answer":"7","marks":1},
  {"question":"Easy: Which is a compiled language?","level":"easy","options":["Python","C","JavaScript","HTML"],"answer":"C","marks":1},
  {"question":"Easy: 9 + 8 = ?","level":"easy","options":["16","17","18","15"],"answer":"17","marks":1},

  {"question":"Intermediate: Next number: 2, 6, 12, 20, ?","level":"intermediate","options":["30","28","26","32"],"answer":"30","marks":1},
  {"question":"Intermediate: A train travels 60 km in 50 min. Speed in km/h?","level":"intermediate","options":["72","75","70","80"],"answer":"72","marks":1},
  {"question":"Intermediate: Which data structure uses key-value pairs?","level":"intermediate","options":["Array","Object","Stack","Queue"],"answer":"Object","marks":1},
  {"question":"Intermediate: 15% of 200?","level":"intermediate","options":["25","30","35","40"],"answer":"30","marks":1},
  {"question":"Intermediate: Find missing number: 1,2,4,8, ?, 32","level":"intermediate","options":["14","16","18","20"],"answer":"16","marks":1},
  {"question":"Intermediate: What is 12 * 12?","level":"intermediate","options":["144","124","134","154"],"answer":"144","marks":1},
  {"question":"Intermediate: 45 / 9 = ?","level":"intermediate","options":["5","6","4","7"],"answer":"5","marks":1},
  {"question":"Intermediate: Which sorting is fastest on average?","level":"intermediate","options":["Bubble Sort","Quick Sort","Insertion Sort","Selection Sort"],"answer":"Quick Sort","marks":1},
  {"question":"Intermediate: If x=5, y=3, find x^2 + y^2","level":"intermediate","options":["25","34","26","35"],"answer":"34","marks":1},
  {"question":"Intermediate: Next in series: 3, 6, 12, 24, ?","level":"intermediate","options":["48","36","30","50"],"answer":"48","marks":1},
  {"question":"Intermediate: Which is non-relational database?","level":"intermediate","options":["MySQL","PostgreSQL","MongoDB","Oracle"],"answer":"MongoDB","marks":1},
  {"question":"Intermediate: Output of: console.log(typeof 123)","level":"intermediate","options":["Number","String","Object","Boolean"],"answer":"Number","marks":1},
  {"question":"Intermediate: Find missing number: 5, 10, 20, 40, ?","level":"intermediate","options":["70","80","75","90"],"answer":"80","marks":1},
  {"question":"Intermediate: 25% of 400?","level":"intermediate","options":["100","120","80","110"],"answer":"100","marks":1},
  {"question":"Intermediate: 144 / 12 = ?","level":"intermediate","options":["10","11","12","13"],"answer":"12","marks":1},
  {"question":"Intermediate: 7 * 8 = ?","level":"intermediate","options":["54","56","58","52"],"answer":"56","marks":1},
  {"question":"Intermediate: Next number: 2,6,18,54, ?","level":"intermediate","options":["108","162","120","144"],"answer":"162","marks":1},
  {"question":"Intermediate: Which algorithm is divide and conquer?","level":"intermediate","options":["Merge Sort","Bubble Sort","Insertion Sort","Linear Search"],"answer":"Merge Sort","marks":1},
  {"question":"Intermediate: What is 2^5?","level":"intermediate","options":["32","16","64","25"],"answer":"32","marks":1},
  {"question":"Intermediate: 150 / 5 = ?","level":"intermediate","options":["30","35","25","28"],"answer":"30","marks":1},

  {"question":"Hard: Next number: 2, 6, 12, 20, 30, ?","level":"hard","options":["38","40","42","36"],"answer":"42","marks":1},
  {"question":"Hard: Output: int x=5; x+=x++ + ++x;","level":"hard","options":["15","16","14","13"],"answer":"16","marks":1},
  {"question":"Hard: Find next number: 1, 1, 2, 6, 24, ?","level":"hard","options":["120","48","36","24"],"answer":"120","marks":1},
  {"question":"Hard: Which data structure is best for LIFO?","level":"hard","options":["Queue","Stack","Array","LinkedList"],"answer":"Stack","marks":1},
  {"question":"Hard: If 3x + 7 = 25, find x","level":"hard","options":["6","5","7","8"],"answer":"6","marks":1},
  {"question":"Hard: Next in series: 2, 3, 5, 9, 17, ?","level":"hard","options":["31","33","34","35"],"answer":"33","marks":1},
  {"question":"Hard: Output: int a=7,b=2; System.out.println(a/b);","level":"hard","options":["3.5","3","4","Error"],"answer":"3","marks":1},
  {"question":"Hard: If array=[1,2,3], push(4), pop(), top()","level":"hard","options":["3","4","2","Error"],"answer":"3","marks":1},
  {"question":"Hard: Next number: 1, 4, 9, 16, ?","level":"hard","options":["20","25","24","21"],"answer":"25","marks":1},
  {"question":"Hard: 5^3 = ?","level":"hard","options":["125","120","150","135"],"answer":"125","marks":1},
  {"question":"Hard: 144 / 12 + 5*2 = ?","level":"hard","options":["22","24","26","28"],"answer":"26","marks":1},
  {"question":"Hard: If x=3, y=4, z=5, find x^2 + y^2 - z^2","level":"hard","options":["0","1","2","-1"],"answer":"0","marks":1},
  {"question":"Hard: Next in series: 2,6,12,20,30,42, ?","level":"hard","options":["50","56","54","60"],"answer":"56","marks":1},
  {"question":"Hard: Find missing: 3,9,27, ?, 243","level":"hard","options":["81","72","90","84"],"answer":"81","marks":1},
  {"question":"Hard: Output: int a=2; a*=3+4; System.out.println(a);","level":"hard","options":["14","10","12","16"],"answer":"14","marks":1}
];

async function seedQuestions() {
  try {
    await AptitudeQuestion.deleteMany();
    await AptitudeQuestion.insertMany(questions);
    console.log(" MCQs Inserted Successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedQuestions();
