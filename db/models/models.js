const db = require("../connection");

exports.locateTopics = (stuff) => {
  return db.query("SELECT * from topics;").then((results) => {
    return results.rows;
  });
};

exports.locateArticleId = (article_Id) => {
  if (article_Id > 500) {
    return Promise.reject({ status: 404, msg: "not found" });
  }

  console.log(article_Id, "fail test");
  let querys = `SELECT * FROM articles WHERE article_id = ${article_Id};`;
  console.log(querys);
  return db.query(querys).then((results) => {
    // console.log(results.rows[0], "----dem");
    return results.rows[0];
  });
};
