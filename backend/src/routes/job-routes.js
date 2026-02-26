const JobController = require("../controllers/job-controller");
const express = require("express");
const router = express.Router();

router.post("/compare-with-jobIds", JobController.compareGithubWithJobIds);
router.get("/:jobId", JobController.getJob);

module.exports = router;
