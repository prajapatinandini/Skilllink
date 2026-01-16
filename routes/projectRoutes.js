const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const auth = require("../middleware/authMiddleware");

router.post("/add", auth, projectController.addProject);
router.get("/user", auth, projectController.getUserProjects);
router.delete("/:projectId", auth, projectController.deleteProject);

module.exports = router;
