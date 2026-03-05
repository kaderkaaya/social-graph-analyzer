import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
//const SOCKET_URL = "http://localhost:3000";

let socket = null;

export function getSocket() {
  if (typeof window === "undefined") return null;
  if (socket?.connected) return socket;
  socket = io(SOCKET_URL, {
    autoConnect: true,
  });
  return socket;
}

export function joinJobRoom(jobId, handlers = {}) {
  const s = getSocket();
  if (!s) return;

  s.emit("join-job", jobId);

  if (handlers.onProgress) {
    s.on("progress", handlers.onProgress);
  }
  if (handlers.onJobFailed) {
    s.on("job-failed", handlers.onJobFailed);
  }
}

export function leaveJobRoom(handlers = {}) {
  const s = getSocket();
  if (!s) return;
  if (handlers.onProgress) s.off("progress", handlers.onProgress);
  if (handlers.onJobFailed) s.off("job-failed", handlers.onJobFailed);
}
