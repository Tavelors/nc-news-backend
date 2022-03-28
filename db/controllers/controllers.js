const { locateTopics, locateArticleId } = require("../models/models");

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
