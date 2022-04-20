const {
  locateTopics,
  locateArticleId,
  updateArticleId,
  locateUsers,
  locateArticles,
  locateArticleIdComments,
  addArticleIdComments,
  removeCommentById,
  locateCommentById,
} = require("../models/models");
const fs = require("fs/promises");
const endPoint = require("../../endpoints.json");

exports.getTopics = (req, res, next) => {
  locateTopics(req.params)
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch(next);
};

exports.getArticleId = (req, res, next) => {
  const { article_id } = req.params;
  locateArticleId(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.patchArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    const patchArticle = await updateArticleId(article_id, inc_votes);
    res.status(202).send({ article: patchArticle });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await locateUsers();
    res.status(200).send({ users: users });
  } catch (err) {
    next(err);
  }
};
////////////////////////////////////////////
exports.getArticles = async (req, res, next) => {
  try {
    const { sort_by } = req.query;
    const { order } = req.query;
    const { topic } = req.query;
    const articles = await locateArticles(sort_by, order, topic);
    res.status(200).send({ articles: articles });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getArticleIdComments = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const articleComments = await locateArticleIdComments(article_id);
    res.status(200).send({ comments: articleComments });
  } catch (err) {
    next(err);
  }
};

exports.postArticleIdComments = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const articleComment = await addArticleIdComments(req.body, article_id);
    res.status(201).send({ comment: articleComment });
  } catch (err) {
    next(err);
  }
};

exports.deleteCommentById = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const comment = await removeCommentById(comment_id);
    res.status(204).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.getCommentById = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const comment = await locateCommentById(comment_id);
    res.status(200).send({ comment: comment });
  } catch (err) {
    next(err);
  }
};

exports.getApi = async (req, res, next) => {
  try {
    res.status(200).send(endPoint);
  } catch (err) {
    next(err);
  }
};
