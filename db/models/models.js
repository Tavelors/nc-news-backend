const db = require("../connection");
const fs = require("fs/promises");
const format = require("pg-format");

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

  //   const formatQuery = format(
  //     `select * from %I where %I = $1;`,
  //     "comments",
  //     "author"
  //   );
  //   const newResult = await db.query(formatQuery, [result.rows[0].author]);
  const newResult = await db.query(
    `SELECT * FROM comments WHERE author = '${result.rows[0].author}';`
  );
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

exports.locateArticles = async (
  sort_by = "created_at",
  order = "DESC",
  topic
) => {
  const validColumns = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];
  if (!validColumns.includes(sort_by))
    return Promise.reject({ status: 400, msg: "invalid request" });
  let query = `SELECT * FROM articles`;
  if (topic) query += ` WHERE topic = '${topic}'`;
  if (sort_by) query += ` ORDER BY ${sort_by} ${order}`;
  query += ";";
  const querys = db.query(query);
  const result = await querys;
  if (result.rows.length === 0)
    return Promise.reject({ status: 400, msg: "invalid request" });
  const queryComments = db.query(
    `SELECT * FROM comments WHERE author = '${result.rows[0].author}';`
  );
  const newResult = await queryComments;
  result.rows.forEach(
    (rows) => (rows["comment_count"] = newResult.rows.length)
  );
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

exports.addArticleIdComments = async (body, article_id) => {
  const commentCheck = {
    body: "body",
    username: "username",
  };
  for (let prop in commentCheck) {
    if (typeof body[prop] !== typeof commentCheck[prop]) {
      return Promise.reject({ status: 400, msg: "invalid request" });
    }
  }
  const query = db.query(
    `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
    [body.username, body.body, article_id]
  );
  const result = await query;
  return result.rows[0];
};

exports.removeCommentById = async (comment_id) => {
  const query = db.query(
    `DELETE FROM comments WHERE comment_id = ${comment_id};`
  );
  const result = await query;
  if (result.rowCount === 0) {
    return Promise.reject({ status: 404, msg: "not found" });
  }
  return result.rows[0];
};

exports.locateCommentById = async (comment_id) => {
  const query = db.query(
    `SELECT * FROM comments WHERE comment_id = ${comment_id}`
  );
  const result = await query;
  return result.rows;
};
