class CompareService {
  static async compareFollowersFollowing(followers, following) {
    const followersSet = new Set(followers);
    const followingSet = new Set(following);

    const notFollowingBack = [];
    for (const u of followingSet) {
      if (!followersSet.has(u)) notFollowingBack.push(u);
    }

    const notFollowedBack = [];
    for (const u of followersSet) {
      if (!followingSet.has(u)) notFollowedBack.push(u);
    }

    return { notFollowingBack, notFollowedBack };
  }
}

module.exports = CompareService;
