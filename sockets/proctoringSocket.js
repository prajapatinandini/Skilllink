module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("startProctoring", (data) => {
      console.log("Start Proctoring:", data);
      // Broadcast to everyone or do server logic
      socket.emit("proctoringStarted", { ...data, time: new Date() });
    });

    socket.on("stopProctoring", (data) => {
      console.log("Stop Proctoring:", data);
      socket.emit("proctoringStopped", { ...data, time: new Date() });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
