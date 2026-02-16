const mongoose = require("mongoose");

const AptitudeResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  score: { type: Number, default: 0 }
});

module.exports = mongoose.model("AptitudeResult", AptitudeResultSchema);
