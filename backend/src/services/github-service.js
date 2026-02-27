const { getFollowers, getFollowing } = require("../helpers/github");
const CompareService = require("../core/compare-service");
class GithubService {
  static async compareGithubUsers({ username }, job) {
    await job.updateProgress(30);
    const [followersRes, followingRes] = await Promise.all([
      getFollowers(username),
      getFollowing(username),
    ]);
    await job.updateProgress(50);
    await job.updateProgress(60);
    const { notFollowingBack, notFollowedBack } =
      await CompareService.compareFollowersFollowing(
        followersRes.logins,
        followingRes.logins,
      );
    await job.updateProgress(90);
    return {
      username,
      counts: {
        followersFetched: followersRes.logins.length,
        followingFetched: followingRes.logins.length,
        notFollowingBack: notFollowingBack.length,
        notFollowedBack: notFollowedBack.length,
      },
      truncated: {
        followers: followersRes.truncated,
        following: followingRes.truncated,
      },
      result: {
        notFollowingBack,
        notFollowedBack,
      },
    };
  }
}

module.exports = GithubService;
