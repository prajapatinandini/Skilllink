const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { addViolation } = require("../controllers/proctorController");

router.post("/violation", auth, addViolation);

module.exports = router;
