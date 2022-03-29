const express = require("express");
const app = express();
app.use(express.json());
const {
  getTopics,
  getArticleId,
  patchArticleId,
} = require("./db/controllers/controllers");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleId);

app.patch("/api/articles/:article_id", patchArticleId);

app.use((err, req, res, next) => {
  // console.log(err, "<--error");
  if (err.status === 404) {
    res.status(404).send({ msg: "not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "500" });
});

module.exports = app;
