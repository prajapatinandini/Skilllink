const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware"); 
const aptitudeController = require("../controllers/aptitudeController");


router.get("/start/:level", auth, aptitudeController.startTest);

router.post("/:attemptId", auth, aptitudeController.submitTest);

router.post("/violation/:attemptId", auth, aptitudeController.reportViolation);

module.exports = router;
