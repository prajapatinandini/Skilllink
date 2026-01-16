const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    techStack: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
