require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const projectRoutes = require("./routes/projectRoutes");
const evaluationRoutes = require("./routes/evaluationRoutes");
const aptitudeRoutes = require("./routes/aptitudeRoutes");
const proctoringSocket = require("./sockets/proctoringSocket");
const codingRoutes = require("./routes/codingRoutes");
const finalScoreRoutes = require("./routes/finalScoreRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});
app.use(cors({ origin: "*" }));
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Default page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

connectDB();

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/coding", codingRoutes); 
app.use("/api/final-score", finalScoreRoutes);
app.use("/api/proctor", require("./routes/proctorRoutes"));


proctoringSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
