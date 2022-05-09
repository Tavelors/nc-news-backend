const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const {
  getTopics,
  getArticleId,
  patchArticleId,
  getUsers,
  getArticles,
  getArticleIdComments,
  postArticleIdComments,
  deleteCommentById,
  getCommentById,
  getApi,
} = require("./db/controllers/controllers");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleId);

app.patch("/api/articles/:article_id", patchArticleId);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleIdComments);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/comments/:comment_id", getCommentById);

app.post("/api/articles/:article_id/comments", postArticleIdComments);

app.get("/api", getApi);

app.use((err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ msg: "invalid request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ msg: "not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const errorCodes = ["22P02", "42703", "23503", "42601"];
  if (errorCodes.includes(err.code)) {
    res.status(400).send({ msg: "bad request" });
  } else {
    console.log(err);
    res.status(500).send({ msg: "500" });
  }
});

module.exports = app;
