//const jobs = new Map();
//burda artık set yerine queue kullanılır.
const Redis = require("ioredis");
const redisConnection = require("../config/redis");
const redisClient = new Redis(redisConnection);

const CACHE_KEY_PREFIX = "github-compare:result:";
const jobsQueue = require("../jobs/jobs-queue");

class JobsStore {
  static async compareWithJobIds({ username }) {
    const cacheKey = `${CACHE_KEY_PREFIX}${username}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        jobId: parsed.jobId,
        status: "completed",
        result: parsed.result,
        message: "from cache",
      };
    }

    const existingJobs = await jobsQueue.getJobs([
      "pending",
      "active",
      "delayed",
    ]);
    const existingJob = existingJobs.find(
      (j) => j.data && j.data.username === username,
    );
    if (existingJob) {
      const state = await existingJob.getState();
      return {
        jobId: existingJob.id,
        status: state,
        message: "existing job",
      };
    }

    const job = await jobsQueue.add(
      "github-compare",
      { username },
      {
        attempts: 3, //hata durumunda 3 kere tekrar denenir.
        backoff: { type: "exponential", delay: 5000 }, //hata durumunda 5 saniye sonra tekrar denenir.
      },
    );
    //jobs.set(jobId, job);

    /*this.runComparisonTask({
      jobId: job.id,
      username,
    });
    */

    return {
      jobId: job.id,
      status: "pending",
      message: "added to queue",
    };
  }

  /*static async runComparisonTask({ jobId, username }) {
    const job = jobs.get(jobId);
    if (!job) {
      throw new Error("failed to run comparison task");
    }
    job.status = "running";
    job.progress = 0;
    const result = await GithubService.compareGithubUsers({ username });
    if (job) {
      job.status = "completed";
      job.progress = 100;
      job.result = result;
      job.updatedAt = new Date();
    }
    return job;
  }*/
  //burda artık queue'ya eklenen job'ları çalıştırır.
  //runComparisonTask fonksiyonu artık kullanılmaz.
  //çünkü bullmq ile job'ları çalıştırır.
  //burda status ve progress bilgileri queue'dan alınır.
  //eğer set ederek yani  bizim nodejsmizde değilde rediste tutuyoruz.
  //bu yüzden bu fonksiyon artık kullanılmaz.

  static async getJob({ jobId }) {
    const job = await jobsQueue.getJob(jobId);
    if (!job) {
      return null;
    }
    const state = await job.getState();
    return {
      jobId: job.id,
      status: state,
      progress: job.progress,
      result: job.returnvalue,
      failedReason: job.failedReason,
    };
  }
}
module.exports = JobsStore;
