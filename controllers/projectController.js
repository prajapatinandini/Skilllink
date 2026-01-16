const Project = require("../models/projectModel");

//add project
exports.addProject = async (req, res) => {
  try {
    const { title, url, techStack } = req.body;

    const project = await Project.create({
      user: req.user.id,
      title,
      url,
      techStack
    });

    res.json({
      message: "Project added successfully",
      project
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get project
exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update project
exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const deleted = await Project.findOneAndDelete({
      _id: projectId,
      user: req.user.id
    });

    if (!deleted)
      return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
