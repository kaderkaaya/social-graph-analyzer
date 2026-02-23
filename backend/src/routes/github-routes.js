const GithubController = require("../controllers/github-controller");
const express = require("express");
const router = express.Router();

router.post("/compare", GithubController.compareGithubUsers);

module.exports = router;