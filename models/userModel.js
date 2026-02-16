const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    firebaseUID: String,

    otp: String,
    otpExpiry: Date,

    college: String,
    branch: String,
    semester: String,
    skills: [String],
    githubUsername: String,
    resumeUrl: String,

    role: {
      type: String,
      enum: ["student", "company"],
      default: "student"
    },

    techStack: {
  type: [{
    type: String,
    enum: [
      "html","css","javascript","python","java","cpp",
      "react","node","express","mongodb","nosql",
      "mysql","sql","php","ruby","swift","kotlin",
      "typescript","flutter"
    ]
  }],
  default: []
},


    profileCompleted: {
      type: Boolean,
      default: false
    }

  }, { timestamps: true });



userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
