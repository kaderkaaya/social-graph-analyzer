const { createGithubClient } = require("./github-client");
const MAX_ITEMS = Number(process.env.MAX_ITEMS) || 2000;
const PER_PAGE = 100;
const client = createGithubClient();

async function fetchPageLogins(baseUrl, pageNum) {
  const sep = baseUrl.includes("?") ? "&" : "?";
  const url = `${baseUrl}${sep}page=${pageNum}`;
  const res = await client.get(url);
  return (res.data || []).map((u) => u.login);
}


async function fetchFollowersAndFollowing(username, io, job, totalFollowers, totalFollowing) {
  const totalFollowersPages = Math.ceil(totalFollowers / PER_PAGE);
  const totalFollowingPages = Math.ceil(totalFollowing / PER_PAGE);
  const totalPages = Math.max(totalFollowersPages, totalFollowingPages, 1);

  const followersUrl = `/users/${encodeURIComponent(username)}/followers?per_page=${PER_PAGE}`;
  const followingUrl = `/users/${encodeURIComponent(username)}/following?per_page=${PER_PAGE}`;

  const followersLogins = [];
  const followingLogins = [];
  let followersTruncated = false;
  let followingTruncated = false;

  for (let page = 1; page <= totalPages; page++) {
    const [followersChunk, followingChunk] = await Promise.all([
      page <= totalFollowersPages ? fetchPageLogins(followersUrl, page) : [],
      page <= totalFollowingPages ? fetchPageLogins(followingUrl, page) : [],
    ]);
    for (const login of followersChunk) {
      if (followersLogins.length >= MAX_ITEMS) {
        followersTruncated = true;
        break;
      }
      followersLogins.push(login);
    }
    for (const login of followingChunk) {
      if (followingLogins.length >= MAX_ITEMS) {
        followingTruncated = true;
        break;
      }
      followingLogins.push(login);
    }

    const progress = Math.min(100, (page / totalPages) * 100).toFixed(0);
    if (job) {
      await job.updateProgress(progress);
    }
    if (io && job) {
      io.to(`job-${job.id}`).emit("progress", { progress });
    }
  }

  return {
    followers: { logins: followersLogins, truncated: followersTruncated },
    following: { logins: followingLogins, truncated: followingTruncated },
  };
}

module.exports = { fetchFollowersAndFollowing, fetchPageLogins };
