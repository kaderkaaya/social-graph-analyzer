const jobs = new Map();
const uuid = require("uuid");
const GithubService = require("./github-service");

class JobsStore {
  static async compareWithJobIds({ username }) {
    const jobId = uuid.v4();
    const job = {
      jobId,
      username,
      status: "pending",
      progress: 0,
      result: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jobs.set(jobId, job);

    this.runComparisonTask({
      jobId,
      username,
    });

    return {
      jobId,
      status: "pending",
      message: "Comparison started in background",
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

  static async getJob({ jobId }) {
    const job = jobs.get(jobId);
    if (!job) {
      throw new Error("Job not found");
    }
    return job;
  }
}
module.exports = JobsStore;
