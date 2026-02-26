const GithubService = require("../services/github-service");

class GithubController {
  static async compareGithubUsers(req, res) {
    try {
      const { username } = req.body;
      const result = await GithubService.compareGithubUsers({ username });
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
module.exports = GithubController;
