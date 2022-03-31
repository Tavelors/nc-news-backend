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

exports.locateArticles = async (order_by) => {
  const articleColumns = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];
  const articleQuerys = ["order", []];

  let querys = `SELECT * FROM articles`;
  let arrayForValue = [];
  const keyCheckOrderBy = Object.keys(order_by);
  Object.keys(order_by).forEach((value) => arrayForValue.push(order_by[value]));
  const isEmpty = (order_by) => {
    return Object.keys(order_by).length !== 0;
  };
  if (
    !articleQuerys.includes(keyCheckOrderBy[0]) &&
    keyCheckOrderBy.length !== 0
  ) {
    return Promise.reject({ status: 400, msg: "invalid request" });
  }
  if (!articleColumns.includes(keyCheckOrderBy[0])) {
    if (isEmpty(order_by)) querys += ` ORDER BY ${order_by.order}`;
  }
  if (articleColumns.includes(keyCheckOrderBy[0])) {
    querys += ` WHERE ${keyCheckOrderBy[0]} = '${arrayForValue[0]}'`;
  }
  querys += `;`;
  const query = db.query(querys);
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
  return result.rows[0];
};

exports.locateCommentById = async (comment_id) => {
  const query = db.query(
    `SELECT * FROM comments WHERE comment_id = ${comment_id}`
  );
  const result = await query;
  return result.rows;
};
