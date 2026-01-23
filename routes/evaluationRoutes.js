const express = require("express");
const router = express.Router();
const { evaluateProject, getAverageScore } = require("../controllers/evaluationController");
const auth = require("../middleware/authMiddleware");

console.log("auth:", auth);
console.log("evaluateProject:", evaluateProject);
console.log("getAverageScore:", getAverageScore);

router.post("/evaluate", auth, evaluateProject);
router.get("/average-score", auth, getAverageScore);

module.exports = router;
