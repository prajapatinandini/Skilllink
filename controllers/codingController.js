require("dotenv").config();
const axios = require("axios");
const CodingQuestion = require("../models/CodingQuestion");
const CodingAttempt = require("../models/CodingAttempt");
const TestCase = require("../models/TestCase");
const ProctorLog = require("../models/ProctorLog");

// ------------------- UTILS -------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const languageMap = {
  javascript: "nodejs",   // 🔥 THIS WAS THE BREAKING POINT
  node: "nodejs",
  python: "python3",
  python3: "python3",
  java: "java",
  cpp: "cpp",
  "c++": "cpp"
};

const getLanguageId = (lang) => languageMap[String(lang).toLowerCase()] || 63;

// Normalize output: case-sensitive, remove extra spaces and carriage returns
const normalizeOutput = (out) =>
  (out ?? "")
    .toString()
    .replace(/\r/g, "")
    .trim()
    .replace(/[ \t]+/g, " ")
    .replace(/\n+/g, "\n");

// ------------------- START CODING TEST -------------------
exports.startCodingTest = async (req, res) => {
  try {
    let techStack = req.user?.techStack || ["javascript"];
    if (!Array.isArray(techStack)) techStack = [techStack];
    techStack = techStack.map((l) => l.toLowerCase());

    const pickQuestion = async (difficulty) => {
      const q = await CodingQuestion.aggregate([
        { $match: { difficulty, languages: { $in: techStack } } },
        { $sample: { size: 1 } },
      ]);
      if (!q.length) return null;
      const lang = q[0].languages.find((l) => techStack.includes(l.toLowerCase()));
      return { ...q[0], selectedLanguage: lang };
    };

    const easyQ = await pickQuestion("easy");
    const hardQ = await pickQuestion("hard");

    if (!easyQ || !hardQ)
      return res
        .status(400)
        .json({ message: "Not enough questions available for your tech stack" });

  
    const questions = Math.random() < 0.5 ? [easyQ, hardQ] : [hardQ, easyQ];

    const attempt = await CodingAttempt.create({
      userId: req.user.id,
      questions: questions.map((q) => ({ questionId: q._id, language: q.selectedLanguage })),
      startedAt: new Date(),
    });

    res.json({
      attemptId: attempt._id,
      duration: 90,
      questions: questions.map((q) => ({
        _id: q._id,
        title: q.title,
        description: q.description,
        difficulty: q.difficulty,
        language: q.selectedLanguage,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------- SUBMIT CODING TEST -------------------




exports.submitCodingTest = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { submissions } = req.body;

    if (!submissions || !Array.isArray(submissions) || submissions.length === 0) {
      return res.status(400).json({ message: "No submissions provided" });
    }

    const attempt = await CodingAttempt.findById(attemptId);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    let totalScore = 0;
    let totalTests = 0;
    const questionResults = [];
    const aiReports = [];
    const proctorEvents = await ProctorLog.find({ attemptId });

    for (const sub of submissions) {
      const attemptQ = attempt.questions.find(q => String(q.questionId) === String(sub.questionId));
      if (!attemptQ) continue;

      const testCases = await TestCase.find({ questionId: sub.questionId });
      let passed = 0;
      const errors = [];

      for (const tc of testCases) {
        totalTests++;

        try {
          
          const response = await axios.post(
            "https://emkc.org/api/v2/piston/execute",
            {
              language: languageMap[attemptQ.language.toLowerCase()] || "javascript",
              source: sub.code,
              stdin: tc.input
            },
            { timeout: 15000 }
          );

          const rawOutput = response.data.output ?? "";
          const userOut = normalizeOutput(rawOutput);
          const expectedOut = normalizeOutput(tc.output);

          if (userOut === expectedOut) {
            passed++;
          } else {
            errors.push({
              input: tc.input,
              expected: expectedOut,
              got: userOut,
              status: "Failed"
            });
          }
        } catch (e) {
          errors.push({ input: tc.input, error: e.message });
        }
      }

      attemptQ.code = sub.code;
      attemptQ.passed = passed;
      attemptQ.total = testCases.length;
      totalScore += passed;

      questionResults.push({
        questionId: sub.questionId,
        passed,
        total: testCases.length,
        errors
      });

   
    }

    for (const q of attempt.questions) {
      if (q.passed == null) {
        q.passed = 0;
        q.total = await TestCase.countDocuments({ questionId: q.questionId });
      }
    }

    attempt.score = totalScore;
    attempt.aiReview = aiReports;
    attempt.flagged = aiReports.some(r => r.riskLevel === "HIGH");
    attempt.submittedAt = new Date();

    await attempt.save();

    res.json({
      score: totalScore,
      totalTests,
      questions: questionResults,
      aiReview: aiReports,
      flagged: attempt.flagged
    });

  } catch (err) {
    console.error("Submit Coding Test Error:", err);
    res.status(500).json({ error: err.message });
  }
};



// ------------------- AI CHEATING -------------------
async function analyzeWithAI({ code, proctorEvents }) {
  try {
    const truncatedEvents = JSON.stringify(proctorEvents).slice(0, 2000);
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Return JSON {aiGeneratedProbability:number,behaviorRisk:number,riskLevel:'LOW'|'MEDIUM'|'HIGH'}" },
          { role: "user", content: `Code:\n${code}\nEvents:\n${truncatedEvents}` },
        ],
        temperature: 0,
        max_tokens: 300,
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_KEY}` } }
    );

    const content = response.data.choices[0].message.content;
    const parsed = JSON.parse(content);
    if (
      typeof parsed.aiGeneratedProbability === "number" &&
      typeof parsed.behaviorRisk === "number" &&
      ["LOW", "MEDIUM", "HIGH"].includes(parsed.riskLevel)
    )
      return parsed;

    return { aiGeneratedProbability: 0, behaviorRisk: 0, riskLevel: "LOW" };
  } catch {
    return { aiGeneratedProbability: 0, behaviorRisk: 0, riskLevel: "LOW" };
  }
}


exports.logProctorEvent = async (req, res) => {
  try {
    await ProctorLog.create({
      attemptId: req.body.attemptId,
      userId: req.user.id,
      type: req.body.type,
    });
    res.json({ status: "logged" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
