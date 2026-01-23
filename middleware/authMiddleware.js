const jwt = require("jsonwebtoken");
const User = require("../models/userModel");  // FIX: correct variable name

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ALWAYS set req.user.id
    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name
    };

    next();
  } catch (err) {
    console.log("Auth error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
