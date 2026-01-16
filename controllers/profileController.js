const User = require("../models/userModel");
const path = require("path");

// Complete Profile
exports.completeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      college,
      branch,
      semester,
      skills,
      githubUsername,
    } = req.body;

    
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
        isProfileCompleted: true,
      },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile completed successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

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

    const { projects, ...otherUpdates } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

  
   
    Object.assign(user, otherUpdates);

    
    if (req.file) {
      user.resumeUrl = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: await User.findById(userId).select("-password"),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
