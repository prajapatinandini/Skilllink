const mongoose = require("mongoose");

module.exports = mongoose.model("CodingQuestion", new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,
  languages: [String]
}));
