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
    return results.rows[0];
  });
};

exports.updateArticleId = async (article_id, newVote) => {
  //   console.log(newVote, "vote");
  const query = `UPDATE articles SET votes = votes + ${newVote} WHERE article_id = ${article_id} RETURNING *;`;
  //   console.log(query);
  const result = await db.query(query);
  if (result.rows.length === 0) {
    return Promise.reject({ msg: "not found", status: 404 });
  }
  return result.rows[0];
};
