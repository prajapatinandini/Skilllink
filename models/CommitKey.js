const mongoose = require("mongoose");

const commitKeySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  commitKey: { type: String, required: true },
  verified: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("CommitKey", commitKeySchema);
