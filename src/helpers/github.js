const { createGithubClient } = require("./github-client");
const { parseNextLink } = require("./github-pagination");

const client = createGithubClient();

async function fetchAllLogins(initialUrl, maxItems) {
    const logins = [];
    let url = initialUrl;

    while (url) {
        const res = await client.get(url);
        const arr = res.data;
        for (const u of arr) {
            logins.push(u.login);
            if (logins.length >= maxItems) {
                return { logins, truncated: true };
            }
        }

        url = parseNextLink(res.headers.link);
    }

    return { logins, truncated: false };
}

async function getFollowers(username, maxItems) {
    const url = `/users/${encodeURIComponent(username)}/followers?per_page=100`;
    return fetchAllLogins(url, maxItems);
}

async function getFollowing(username, maxItems) {
    const url = `/users/${encodeURIComponent(username)}/following?per_page=100`;
    return fetchAllLogins(url, maxItems);
}

module.exports = { getFollowers, getFollowing };
