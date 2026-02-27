const redis = require('ioredis');

const redisConnection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null, //bullmq için null olmalı ve zorunludur.
}
module.exports = redisConnection;