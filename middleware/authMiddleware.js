const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.startsWith("Bearer ")
    ? header.split(" ")[1]
    : header;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select(
      "_id name email role profileCompleted techStack"
    );

    if (!user)
      return res.status(404).json({ message: "User not found" });

    
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      profileCompleted: user.profileCompleted,
      techStack: user.techStack
    };

    next();
  } catch (err) {
    console.log("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
