const { getFollowers, getFollowing } = require("../helpers/github");
const CompareService = require("../core/compare-service");
class GithubService {
  static async compareGithubUsers({ username }) {
    const [followersRes, followingRes] = await Promise.all([
      getFollowers(username),
      getFollowing(username),
    ]);

    const { notFollowingBack, notFollowedBack } =
      await CompareService.compareFollowersFollowing(
        followersRes.logins,
        followingRes.logins,
      );

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
