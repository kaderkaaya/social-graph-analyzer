const { fetchFollowersAndFollowing } = require("../helpers/github");
const CompareService = require("../core/compare-service");
const { getIo } = require("../config/socket");

class GithubService {
  static async compareGithubUsers(
    { username, totalFollowers = 0, totalFollowing = 0 },
    job,
  ) {
    const io = getIo();
    const { followers, following } = await fetchFollowersAndFollowing(
      username,
      io,
      job,
      totalFollowers,
      totalFollowing,
    );
    const { notFollowingBack, notFollowedBack } =
      await CompareService.compareFollowersFollowing(
        followers.logins,
        following.logins,
      );
    return {
      username,
      counts: {
        followersFetched: followers.logins.length,
        followingFetched: following.logins.length,
        notFollowingBack: notFollowingBack.length,
        notFollowedBack: notFollowedBack.length,
      },
      truncated: {
        followers: followers.truncated,
        following: following.truncated,
      },
      result: {
        notFollowingBack,
        notFollowedBack,
      },
    };
  }
}

module.exports = GithubService;
