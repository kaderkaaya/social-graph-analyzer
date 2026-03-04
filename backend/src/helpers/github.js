const { createGithubClient } = require("./github-client");
const { parseNextLink } = require("./github-pagination");
const MAX_ITEMS = process.env.MAX_ITEMS || 2000;
const client = createGithubClient();

async function fetchAllLogins(
  initialUrl,
  io,
  job,
  followersCountProgress,
  followingCountProgress,
) {
  const logins = [];
  let url = initialUrl;

  while (url) {
    const res = await client.get(url);
    const arr = res.data;
    if (io)
      io.to(`job-${job.id}`).emit("progress", {
        progress: followersCountProgress,
      });
    for (const u of arr) {
      logins.push(u.login);
      if (logins.length >= MAX_ITEMS) {
        return { logins, truncated: true };
      }
    }
    if (io)
      io.to(`job-${job.id}`).emit("progress", {
        progress: followingCountProgress,
      });
    url = parseNextLink(res.headers.link);
  }

  // 100 sadece worker job'ı bitirdiğinde gönderilir
  return { logins, truncated: false };
}

async function getFollowers(username) {
  const url = `/users/${encodeURIComponent(username)}/followers?per_page=100`;
  return fetchAllLogins(url);
}

async function getFollowing(username) {
  const url = `/users/${encodeURIComponent(username)}/following?per_page=100`;
  return fetchAllLogins(url);
}

module.exports = { getFollowers, getFollowing, fetchAllLogins };
