const express = require("express");
const app = express();
app.use(express.json());
const {
  getTopics,
  getArticleId,
  patchArticleId,
  getUsers,
  getArticles,
  getArticleIdComments,
} = require("./db/controllers/controllers");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleId);

app.patch("/api/articles/:article_id", patchArticleId);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleIdComments);

app.use((err, req, res, next) => {
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
