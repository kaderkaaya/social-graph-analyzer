//const jobs = new Map();
//burda artık set yerine queue kullanılır.
const jobsQueue = require("../jobs/jobs-queue");
const { v4: uuidv4 } = require("uuid");
const GithubService = require("./github-service");

class JobsStore {
  static async compareWithJobIds({ username }) {
    //const jobId = uuidv4();
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

  static async runComparisonTask({ jobId, username }) {
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
  }
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
