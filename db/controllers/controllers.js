const {
  locateTopics,
  locateArticleId,
  updateArticleId,
  locateUsers,
  locateArticles,
} = require("../models/models");

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
    res.status(200).send({ user: users });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const articles = await locateArticles();
    res.status(200).send({ article: articles });
  } catch (err) {
    next(err);
  }
};
