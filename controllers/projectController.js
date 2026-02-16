const Project = require("../models/Project");

// Add project
exports.addProject = async (req, res) => {
  try {
    const { title, repoUrl } = req.body;

    const project = await Project.create({
      userId: req.user.id,
      title,
      repoUrl
    });

    res.json({
      message: "Project added successfully",
      project
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's projects
exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const deleted = await Project.findOneAndDelete({
      _id: projectId,
      userId: req.user.id
    });

    if (!deleted)
      return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
