const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    firebaseUID: String,

    otp: { type: String },
    otpExpiry: { type: Date },


    isProfileCompleted: { type: Boolean, default: false },

    college: String,
    branch: String,
    semester: String,
    skills: [String],
    githubUsername: String,
    resumeUrl: String,

  
  },

  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
