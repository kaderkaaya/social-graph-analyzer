const { Worker } = require("bullmq");
const Redis = require("ioredis");
const redisConnection = require("../config/redis");
const GithubService = require("../services/github-service");
const { createGithubClient } = require("../helpers/github-client");
const redisClient = new Redis(redisConnection);
const CACHE_KEY_PREFIX = "github-compare:result:";
const CACHE_TTL_SEC = 3600;
const { getIo } = require("../config/socket");

const githubClient = createGithubClient();

function safeEmitToJob(jobId, event, payload) {
  const io = getIo();
  io.to(`job-${jobId}`).emit(event, payload);
}

const jobsWorker = new Worker(
  "github-compare",
  async (job) => {
    const { username } = job.data;
    const res = await githubClient.get(
      `/users/${encodeURIComponent(username)}`,
    );
    const userData = res.data;

    const totalFollowers = parseInt(userData.followers, 10) || 0;
    const totalFollowing = parseInt(userData.following, 10) || 0;
    const result = await GithubService.compareGithubUsers(
      { username, totalFollowers, totalFollowing },
      job,
    );
    return result;
  },
  {
    connection: redisConnection,
    concurrency: 1,
    lockDuration: 600000,
    lockRenewTime: 30000,
  },
);

jobsWorker.on("active", (job) => {
  safeEmitToJob(job.id, "job-started", { progress: 0 });
});

jobsWorker.on("completed", (job, result) => {
  const cacheKey = `${CACHE_KEY_PREFIX}${job.data.username}`;
  redisClient.setex(
    cacheKey,
    CACHE_TTL_SEC,
    JSON.stringify({ jobId: job.id, result }),
  );
  safeEmitToJob(job.id, "job-completed", { result });
});

jobsWorker.on("failed", (job, error) => {
  if (job) {
    safeEmitToJob(job.id, "job-failed", {
      error: { message: error?.message || String(error) },
    });
  }
});

module.exports = jobsWorker;
