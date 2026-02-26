const axios = require("axios");

function createGithubClient() {
  const headers = { Accept: "application/vnd.github+json" };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return axios.create({
    baseURL: "https://api.github.com",
    timeout: 15000,
    headers,
  });
}

module.exports = { createGithubClient };
