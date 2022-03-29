const {
  locateTopics,
  locateArticleId,
  updateArticleId,
  locateUsers,
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
      console.log(article, " article---");
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.patchArticleId = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    const patchArticle = await updateArticleId(article_id, inc_votes);
    res.status(202).send({ article: patchArticle });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await locateUsers();
    res.status(200).send({ user: users });
  } catch (err) {
    next(err);
  }
};
