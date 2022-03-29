const db = require("../connection");

exports.locateTopics = (stuff) => {
  return db.query("SELECT * from topics;").then((results) => {
    return results.rows;
  });
};

exports.locateArticleId = async (article_Id) => {
  const queryArticles = db.query(
    `SELECT * FROM articles WHERE article_id = ${article_Id};`
  );
  const result = await queryArticles;

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "not found" });
  }

  const queryComments = db.query(
    `select * from comments where author = '${result.rows[0].author}';`
  );
  const newResult = await queryComments;

  result.rows[0]["comment_count"] = newResult.rows.length;

  return result.rows[0];
};

exports.updateArticleId = async (article_id, newVote) => {
  const query = `UPDATE articles SET votes = votes + ${newVote} WHERE article_id = ${article_id} RETURNING *;`;

  const result = await db.query(query);
  if (result.rows.length === 0) {
    return Promise.reject({ msg: "not found", status: 404 });
  }
  return result.rows[0];
};

exports.locateUsers = async () => {
  const query = `SELECT * FROM users`;
  const result = await db.query(query);
  return result.rows;
};

exports.locateArticles = async () => {
  const query = db.query(`SELECT * FROM articles`);
  const result = await query;
  const queryComments = db.query(
    `select * from comments where author = '${result.rows[0].author}';`
  );
  const newResult = await queryComments;
  result.rows.forEach((rows) => {
    rows["comment_count"] = newResult.rows.length;
  });
  return result.rows;
};

exports.locateArticleIdComments = async (article_id) => {
  const query = db.query(
    `SELECT * FROM comments WHERE article_id = ${article_id}`
  );
  const result = await query;
  if (result.rows.length === 0) {
    return Promise.reject({ msg: "not found", status: 404 });
  }
  return result.rows;
};
