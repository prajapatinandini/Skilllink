const axios = require("axios");
const CommitKey = require("../models/CommitKey");
const Project = require("../models/projectModel");
require("dotenv").config();

// Generate Commit Key (Automatic README Update)
const generateCommitKey = async (req, res) => {
  try {
    const { projectId } = req.body;
    const user = req.user;

    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

    // Fetch project
    const project = await Project.findOne({ _id: projectId, user: user.id });
    if (!project) return res.status(404).json({ success: false, error: "Project not found" });

    const repoUrl = project.url.endsWith(".git") ? project.url.slice(0, -4) : project.url;
    const parts = repoUrl.split("/");
    if (parts.length < 2) return res.status(400).json({ message: "Invalid repo URL" });

    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];

    // Delete any previous keys
    await CommitKey.deleteMany({ userId: user.id, projectId });

    // Generate a new key
    const commitKey = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expiresAt = new Date(Date.now() + (process.env.COMMIT_KEY_EXPIRE_MINUTES || 10) * 60 * 1000);

    // Save key in DB
    const record = await CommitKey.create({
      userId: user.id,
      projectId,
      commitKey,
      expiresAt,
      verified: false
    });

    // Fetch README from GitHub
    const readmeRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "SkillLink-App"
      }
    });

    const sha = readmeRes.data.sha; // Needed to update the file
    const decodedContent = Buffer.from(readmeRes.data.content, "base64").toString("utf8");

    // Replace old key if exists, else append
    let newContent;
    const keyRegex = /KEY-[A-Z0-9]{8}/g;
    if (decodedContent.match(keyRegex)) {
      newContent = decodedContent.replace(keyRegex, `KEY-${commitKey}`);
    } else {
      newContent = decodedContent + `\n\nCommit Verification Key: KEY-${commitKey}`;
    }

    // Encode updated content to base64
    const encodedContent = Buffer.from(newContent, "utf8").toString("base64");

    // Update README via GitHub API
    await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`, {
      message: "Update commit verification key for SkillLink",
      content: encodedContent,
      sha
    }, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "SkillLink-App"
      }
    });

    res.status(200).json({
      success: true,
      message: "Commit key generated and automatically added to README",
      commitKey: `KEY-${commitKey}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Verify Commit Key
const verifyCommitKey = async (req, res) => {
  try {
    const { projectId } = req.body;
    const userId = req.user.id;

    // Fetch project
    const project = await Project.findOne({ _id: projectId, user: userId });
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Fetch latest key
    const record = await CommitKey.findOne({ projectId, userId }).sort({ createdAt: -1 });
    if (!record) return res.status(404).json({ message: "Commit key not found" });

    if (record.verified) return res.status(400).json({ message: "Already verified" });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: "Key expired" });

    // Parse repo
    const repoUrl = project.url.endsWith(".git") ? project.url.slice(0, -4) : project.url;
    const parts = repoUrl.split("/");
    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];

    // Look for commits that modified README.md after the key was created
    const commitsRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits?path=README.md`,
      {
        headers: {
          "User-Agent": "SkillLink-App",
          Authorization: `token ${process.env.GITHUB_TOKEN}`
        }
      }
    );

    const commits = Array.isArray(commitsRes.data) ? commitsRes.data : [];
    const keyWithPrefix = `KEY-${record.commitKey}`;
    const createdAt = new Date(record.createdAt);

    let found = false;
    for (const c of commits) {
      try {
        const commitDate = c.commit && c.commit.author ? new Date(c.commit.author.date) : null;
        if (!commitDate) continue;
        if (commitDate <= createdAt) continue; // only consider commits after key creation

        // Fetch README at this commit SHA
        const sha = c.sha;
        const readmeAtCommit = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/contents/README.md?ref=${sha}`,
          {
            headers: {
              "User-Agent": "SkillLink-App",
              Authorization: `token ${process.env.GITHUB_TOKEN}`
            }
          }
        );

        const content = Buffer.from(readmeAtCommit.data.content, "base64").toString("utf8");
        if (content.includes(keyWithPrefix) || content.includes(record.commitKey)) {
          found = true;
          break;
        }
      } catch (err) {
        // ignore and continue checking other commits
        continue;
      }
    }

    if (!found) {
      // As a fallback, check current README content too (in case commit is recent and not indexed)
      const fileResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/readme`,
        {
          headers: {
            "User-Agent": "SkillLink-App",
            Authorization: `token ${process.env.GITHUB_TOKEN}`
          }
        }
      );

      const decodedContent = Buffer.from(fileResponse.data.content, "base64").toString("utf8");
      if (decodedContent.includes(keyWithPrefix) || decodedContent.includes(record.commitKey)) {
        found = true;
      }
    }

    if (!found) {
      return res.status(400).json({ message: "No README commit found containing the verification key after key generation" });
    }

    // Mark verified
    record.verified = true;
    await record.save();

    res.status(200).json({ success: true, message: "Verification successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { generateCommitKey, verifyCommitKey };
