const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  repoUrl: { type: String, required: true },
  verifiedKey: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// FIX: prevent OverwriteModelError
module.exports = mongoose.models.Project || mongoose.model("Project", projectSchema);
