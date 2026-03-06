const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    socket.on("join-job", (jobId) => {
      socket.join(`job-${jobId}`);
    });
    socket.on("disconnect", () => {});
  });
  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initializeSocket, getIo };
// singleton design pattern kullanıyoruz.
// burda socket io baslatıyoruz ve io yu heryere servis ediyoruz.
