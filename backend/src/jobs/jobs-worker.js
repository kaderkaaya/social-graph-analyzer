const { Worker } = require("bullmq");
const redisConnection = require("../config/redis");
const jobsQueue = require("./jobs-queue");
const GithubService = require("../services/github-service");

const jobsWorker = new Worker(
  "github-compare",
  async (job) => {
   
    const { username } = job.data;
    await job.updateProgress(10);
    const result = await GithubService.compareGithubUsers({ username }, job);
    await job.updateProgress(100);
    return result;
  },
  {
    connection: redisConnection,
    concurrency: 1, //burda githuba artık 1 tane istek atılır. böylece rate limit'i aşmamak için.
  },
);

jobsWorker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed with result: ${result}`);
});

jobsWorker.on("failed", (job, error) => {
  console.log(`Job ${job.id} failed with error: ${error}`);
});
//bizim burda asıl amacımız job'ları queue'ya eklemek ve worker'ları çalıştırmak.
//job'ları queue'ya eklemek için jobsQueue.add('github-compare', { username }) kullanılır.
//burda işlem sıraya alınır sunucuyu kapatsak bile işlem devam eder.
//redis burda cahcelememizi sağlar.
//örnek veriyorum bir kullanıcı tekrar istek atarsa cache'deki sonucu döner.
//workerde queue'ya eklenen job'ları çalıştırır.
//önce queue'ya eklenir sonra worker'lar çalıştırılır.
module.exports = jobsWorker;
