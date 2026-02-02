const mongoose = require("mongoose");

const proctorLogSchema = new mongoose.Schema({
  attemptId: { type: mongoose.Schema.Types.ObjectId },
  userId: mongoose.Schema.Types.ObjectId,
  type: String, // "tab_switch","copy_paste","camera_off","multiple_faces"
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ProctorLog", proctorLogSchema);
