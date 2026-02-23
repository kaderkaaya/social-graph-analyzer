require("dotenv").config();
const githubRoutes = require("./src/routes/github-routes");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/github", githubRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
