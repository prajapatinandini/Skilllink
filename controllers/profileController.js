const User = require("../models/userModel");
const path = require("path");


exports.completeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      college,
      branch,
      semester,
      skills,
      githubUsername
    } = req.body;

    
    if (!college || !branch || !skills || skills.length === 0 || !githubUsername) {
      return res.status(400).json({
        message: "College, branch, skills and GitHub username are required"
      });
    }

    let resumeUrl = req.body.resumeUrl;
    if (req.file) {
      resumeUrl = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        college,
        branch,
        semester,
        skills,
        githubUsername,
        resumeUrl,
        profileCompleted: true 
      },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile completed successfully",
      profileCompleted: user.profileCompleted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    
    delete req.body.profileCompleted;
    delete req.body.isProfileCompleted;

    Object.assign(user, req.body);

    if (req.file) {
      user.resumeUrl = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: await User.findById(userId).select("-password")
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
