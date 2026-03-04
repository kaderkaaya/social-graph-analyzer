require("dotenv").config();
const githubRoutes = require("./src/routes/github-routes");
const jobRoutes = require("./src/routes/job-routes");
const express = require("express");
const cors = require("cors");
require("./src/jobs/jobs-worker");
const { initializeSocket } = require("./src/config/socket");
const http = require("http");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/github", githubRoutes);
app.use("/job", jobRoutes);
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
//burda initializeSocket fonksiyonunu çağırarak aslında http server'ı başlatıyoruz.
initializeSocket(server);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
