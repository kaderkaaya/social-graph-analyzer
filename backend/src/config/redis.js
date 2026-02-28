const redis = require("ioredis");

const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, //bullmq için null olmalı ve zorunludur.
};
module.exports = redisConnection;
