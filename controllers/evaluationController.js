const axios = require("axios");
const OpenAI = require("openai");
const Project = require("../models/projectModel");
const Evaluation = require("../models/Evaluation");
const CommitKey = require("../models/CommitKey");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


exports.evaluateProject = async (req, res) => {
  try {
    const { projectId } = req.body;
    const userId = req.user.id;

    
    const project = await Project
    .findOne({ _id: projectId, user: userId });
    if (!project) return res.status(404).json({ message: "Project not found" });

    
    const key = await CommitKey.findOne({ projectId, userId });
    if (!key || !key.verified) {
      return res.status(400).json({ message: "Commit key not verified" });
    }

    
    const repoPath = project.url.replace("https://github.com/", "");
    const commitsUrl = `https://api.github.com/repos/${repoPath}/commits`;
    const commitsRes = await axios.get(commitsUrl);
    const commits = commitsRes.data;
    const totalCommits = commits.length;

    if (!totalCommits) return res.status(400).json({ message: "No commits found" });

    
    const firstCommit = new Date(commits[commits.length - 1].commit.author.date);
    const lastCommit = new Date(commits[0].commit.author.date);
    const monthsActive = Math.max(1, (lastCommit - firstCommit) / (1000 * 60 * 60 * 24 * 30));

    
    const commitsPerMonth = totalCommits / monthsActive;
    let frequencyPoints =
      commitsPerMonth >= 20 ? 10 :
      commitsPerMonth >= 10 ? 7 :
      commitsPerMonth >= 5 ? 4 : 1;

    
    const commitDays = commits.map(c => c.commit.author.date.split("T")[0]);
    const uniqueDays = new Set(commitDays).size;
    let spreadPoints = 0;
    let suspicious = false;

    if (uniqueDays === 1) {
      spreadPoints = 0;
      suspicious = true; 
    } else if (uniqueDays <= totalCommits / 2) {
      spreadPoints = 6;
    } else {
      spreadPoints = 10;
    }

    
    const commitMessages = commits.map(c => c.commit.message).join("\n");
    let aiCommitScore = 0;
    try {
      const aiCommit = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: `Score these commit messages 0-5:\n${commitMessages}` }]
      });
      aiCommitScore = Number(aiCommit.choices[0].message.content.trim()) || 0;
    } catch { aiCommitScore = 0; }

    const commitScore = frequencyPoints + spreadPoints + aiCommitScore;

   
    let fileList = [];
    try {
      const filesRes = await axios.get(`https://api.github.com/repos/${repoPath}/contents`);
      fileList = JSON.stringify(filesRes.data);
    } catch {}

    
    let codeQualityScore = 0;
    try {
      const aiCode = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: `Analyze project files & give Code Quality score 0-25:\n${fileList}` }]
      });
      codeQualityScore = Number(aiCode.choices[0].message.content.trim()) || 0;
    } catch {}

    
    let structureScore = 0;
    try {
      const aiStructure = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: `Analyze project structure 0-20:\n${fileList}` }]
      });
      structureScore = Number(aiStructure.choices[0].message.content.trim()) || 0;
    } catch {}

 
    let languageScore = 0;
    try {
      const aiLang = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: `Analyze languages used 0-15:\n${fileList}` }]
      });
      languageScore = Number(aiLang.choices[0].message.content.trim()) || 0;
    } catch {}

    
    const activityScore = lastCommit ? 10 : 3;

    
    let authenticityScore = 0;
    try {
      const aiAuth = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: `Analyze if code looks AI-generated or copied, score 0-15:\n${fileList}` }]
      });
      authenticityScore = Number(aiAuth.choices[0].message.content.trim()) || 0;
    } catch {}

    
    const finalScore = commitScore + codeQualityScore + structureScore + languageScore + activityScore + authenticityScore;

    
    const evaluation = await Evaluation.create({
      projectId,
      userId,
      commitScore,
      codeQualityScore,
      structureScore,
      languageScore,
      activityScore,
      authenticityScore,
      finalScore,
      suspicious
    });

    res.status(200).json({ message: "AI Evaluation Completed", evaluation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI Evaluation Error", error: error.message });
  }
};


exports.getAverageScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const evaluations = await Evaluation.find({ userId });

    if (!evaluations.length) return res.status(404).json({ message: "No evaluations found" });

    const avgScore = evaluations.reduce((sum, e) => sum + e.finalScore, 0) / evaluations.length;

    res.status(200).json({
      totalProjects: evaluations.length,
      averageScore: avgScore
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error calculating average score", error: err.message });
  }
};
