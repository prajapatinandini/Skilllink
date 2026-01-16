const CommitKey = require("../models/CommitKey");
const sendEmail = require("../utils/sendEmail");
const axios = require("axios");
require("dotenv").config();

// Generate Commit Key

exports.generateCommitKey = async (req, res) => {
  try {
    const { projectId } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, error: "Unauthorized: User not found" });
    }

    
    await CommitKey.deleteMany({ userId: user.id, projectId, verified: false });

    
    const commitKey = Math.random().toString(36).substring(2, 10).toUpperCase();

    
    const expiresAt = new Date(Date.now() + process.env.COMMIT_KEY_EXPIRE_MINUTES * 60 * 1000);

    
    await CommitKey.create({
      userId: user.id,
      projectId,
      commitKey,
      expiresAt,
      verified: false
    });

   
    if (user.email) {
      await sendEmail(
        user.email,
        "Your Commit Verification Key",
        `Your verification commit key is: KEY-${commitKey}`
      );
    } else {
      console.warn(`User ${user.id} has no email. Skipping email send.`);
    }

   
    res.status(200).json({
      success: true,
      message: user.email
        ? "Commit key generated and emailed successfully"
        : "Commit key generated successfully (email not sent, user has no email)",
      commitKeyExample: `KEY-${commitKey}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// Verify Commit Key

exports.verifyCommitKey = async (req, res) => {
  try {
    const { projectId, repoUrl } = req.body;
    const userId = req.user.id;

    
    const record = await CommitKey.findOne({ userId, projectId });
    if (!record) return res.status(404).json({ message: "Key not found" });
    if (record.verified) return res.status(400).json({ message: "Already verified" });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: "Key expired" });

    
    const cleanedUrl = repoUrl.endsWith(".git") ? repoUrl.slice(0, -4) : repoUrl;
    const parts = cleanedUrl.split("/");
    if (parts.length < 2) return res.status(400).json({ message: "Invalid repo URL" });

    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];

    
    const fileResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          "User-Agent": "SkillLink-App",
          Authorization: `token ${process.env.GITHUB_TOKEN}`

        }
      }
    );

    const encodedContent = fileResponse.data.content;
    const decodedContent = Buffer.from(encodedContent, "base64").toString("utf8");

    
    if (decodedContent.includes(record.commitKey)) {
      record.verified = true;
      await record.save();
      return res.status(200).json({ success: true, message: "Verification successful" });
    }

    return res.status(400).json({ message: "Commit key not found in README.md" });

  } catch (error) {
    console.error(error);

    if (error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ message: "README.md not found in repo" });
      } else if (error.response.status === 403) {
        return res.status(403).json({ message: "GitHub API rate limit exceeded" });
      }
    }

    res.status(500).json({ success: false, error: error.message });
  }
};



