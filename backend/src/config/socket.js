const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", //burda fe bağlantısını yazacağız.
    },
  });
  //aslında burda socket.io'nun connection event'i çalışır.
  //yani client bağlantısı kurulduğunda bu event çalışır.
  //yani fe'den bir istek atıldığında bu event çalışır.
  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("join-job", (jobId) => {
      socket.join(`job-${jobId}`);
      console.log(`user ${socket.id} joined job ${jobId}`);
    });
    socket.on("disconnect", () => {
      console.log("a user disconnected");
    });
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
