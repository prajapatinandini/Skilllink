const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware"); 
const { startCodingRound ,submitCodingTest} = require("../controllers/codingController");

router.get("/start/:tech", auth, startCodingRound);
router.post("/submit", auth, submitCodingTest);


module.exports = router;
