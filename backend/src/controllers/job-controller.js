const JobsStore = require("../services/jobs-store");

class JobController {
  static async compareGithubWithJobIds(req, res) {
    try {
      const { username } = req.body;
      const result = await JobsStore.compareWithJobIds({ username });
      res
        .status(200)
        .json({ message: "data fetched successfully", data: { result } });
    } catch (error) {
      res
        .status(500)
        .json({ message: "data fetched failed", error: error.message });
    }
  }

  static async getJob(req, res) {
    try {
      const { jobId } = req.params;
      const result = await JobsStore.getJob({ jobId });
      res
        .status(200)
        .json({ message: "data fetched successfully", data: { result } });
    } catch (error) {
      res
        .status(500)
        .json({ message: "data fetched failed", error: error.message });
    }
  }
}
module.exports = JobController;
