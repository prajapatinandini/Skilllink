const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/codingController");

router.get("/start", auth, ctrl.startCodingTest);
router.post("/submit/:attemptId", auth, ctrl.submitCodingTest);
router.post("/proctor-log", auth, ctrl.logProctorEvent);

module.exports = router;
