const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");

const jobsQueue = new Queue("github-compare", {
  connection: redisConnection,
});

module.exports = jobsQueue;
