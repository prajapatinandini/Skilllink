require("dotenv").config();
const express = require("express");
const http = require("http"); 
const { Server } = require("socket.io");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const projectRoutes = require("./routes/projectRoutes");
const evaluationRoutes = require("./routes/evaluationRoutes");
const aptitudeRoutes = require("./routes/aptitudeRoutes");
const codeRoutes = require("./routes/codingRoutes");
const proctoringSocket = require("./sockets/proctoringSocket");

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "proctoringTest.html"));
});


connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/code", codeRoutes);

proctoringSocket(io); 

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {   
  console.log(`Server + Proctoring running at http://localhost:${PORT}`);
});
