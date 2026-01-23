require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const path = require("path");
const projectRoutes = require("./routes/projectRoutes");
const keyCommit = require("./routes/keyCommitRoutes");
const evaluationRoutes = require("./routes/evaluationRoutes");

const app = express();

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/commit",keyCommit);
app.use("/api/evaluation", evaluationRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});
