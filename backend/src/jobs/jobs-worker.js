const { Worker } = require("bullmq");
const Redis = require("ioredis");
const redisConnection = require("../config/redis");
const GithubService = require("../services/github-service");
const redisClient = new Redis(redisConnection);
const CACHE_KEY_PREFIX = "github-compare:result:";
const CACHE_TTL_SEC = 3600;
const { getIo } = require("../config/socket");

const jobsWorker = new Worker(
  "github-compare",
  async (job) => {
    const { username } = job.data;
    const response = await fetch(`https://api.github.com/users/${username}`);
    const userData = await response.json();
    const totalFollowers = userData.followers ?? 0;
    const totalFollowing = userData.following ?? 0;
    const result = await GithubService.compareGithubUsers(
      { username, totalFollowers, totalFollowing },
      job,
    );
    await job.updateProgress(100);
    const io = getIo();
    io.to(`job-${job.id}`).emit("progress", { progress: 100 });
    return result;
  },
  //burda worker işlemi bitirdiğinde io ile client'a progress bilgisi gönderiliyor.
  {
    connection: redisConnection,
    concurrency: 1, //burda githuba artık 1 tane istek atılır. böylece rate limit'i aşmamak için.
  },
);

jobsWorker.on("completed", (job, result) => {
  const cacheKey = `${CACHE_KEY_PREFIX}${job.data.username}`;
  redisClient.setex(
    cacheKey,
    CACHE_TTL_SEC,
    JSON.stringify({ jobId: job.id, result }),
  );
});

jobsWorker.on("failed", (job, error) => {
  console.log(`Job ${job.id} failed with error: ${error}`);
  const io = getIo();
  io.to(`job-${job.id}`).emit("job-failed", { error });
});
//bizim burda asıl amacımız job'ları queue'ya eklemek ve worker'ları çalıştırmak.
//job'ları queue'ya eklemek için jobsQueue.add('github-compare', { username }) kullanılır.
//burda işlem sıraya alınır sunucuyu kapatsak bile işlem devam eder.
//redis burda cahcelememizi sağlar.
//örnek veriyorum bir kullanıcı tekrar istek atarsa cache'deki sonucu döner.
//workerde queue'ya eklenen job'ları çalıştırır.
//önce queue'ya eklenir sonra worker'lar çalıştırılır.
module.exports = jobsWorker;
