const User = require("../models/userModel");


// ================= COMPLETE PROFILE =================
exports.completeProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { college, branch, semester, skills, githubUsername, techStack } = req.body;

    if (!college || !branch || !skills || !githubUsername) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const skillsArray = Array.isArray(skills)
      ? skills
      : skills.split(",").map(s => s.trim()).filter(Boolean);

    const allowedTech = [
      "html","css","javascript","python","java","cpp",
      "react","node","express","mongodb","nosql",
      "mysql","sql","php","ruby","swift","kotlin",
      "typescript","flutter"
    ];

    const techStackArray = (Array.isArray(techStack) ? techStack : techStack.split(","))
      .map(t => t.trim())
      .filter(t => allowedTech.includes(t));

    if (techStackArray.length === 0) {
      return res.status(400).json({ message: "Select valid tech stack" });
    }

    let resumeUrl;
    if (req.file) resumeUrl = `/uploads/${req.file.filename}`;

    await User.findByIdAndUpdate(
      userId,
      {
        college,
        branch,
        semester,
        skills: skillsArray,
        githubUsername,
        techStack: techStackArray,
        ...(resumeUrl && { resumeUrl }),
        profileCompleted: true,
      },
      { new: true }
    );

    res.json({ message: "Profile completed successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const allowedFields = [
      "college",
      "branch",
      "semester",
      "skills",
      "githubUsername",
      "techStack",
    ];

    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Convert skills to array
    if (updates.skills && !Array.isArray(updates.skills)) {
      updates.skills = updates.skills
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
    }

    // Convert techStack to array
    if (updates.techStack && !Array.isArray(updates.techStack)) {
      updates.techStack = updates.techStack
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);
    }

    // Resume upload
    if (req.file) {
      updates.resumeUrl = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
