const db = require("../db/connection");
const app = require("../app");
const testdata = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const endPoints = require("../endpoints.json");

afterAll(() => {
  return db.end;
});

beforeEach(() => {
  return seed(testdata);
});

xdescribe("GET /api/topics", () => {
  test("GET respond with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topics.length).toBe(3);
      });
  });
});

describe("GET /api/articles/:article_id (comment count)", () => {
  test("GET respond with an array of articles based on id", async () => {
    const res = await request(app).get("/api/articles/1").expect(200);

    expect(res.body.article).toEqual({
      article_id: expect.any(Number),
      title: expect.any(String),
      topic: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      comment_count: expect.any(Number),
    });
  });
  test("responds with 404 not found when id does not exist", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
  test("responds with a 400 status and msg of bad request", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("GET an article to respond even when article has no comments", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then((res) => {
        expect(res.body.article.comment_count).toBe(0);
      });
  });
});

xdescribe("PATCH /api/articles/:article_id", () => {
  test("responds with the updated article", async () => {
    const res = await request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: 5 })
      .expect(202);
    expect(res.body.article).toEqual({
      article_id: expect.any(Number),
      title: expect.any(String),
      topic: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      created_at: expect.any(String),
      votes: 5,
    });
  });
  test("responds with a 404 status and msg of not found", async () => {
    const res = await request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 5 })
      .expect(404);
    expect(res.body.msg).toBe("not found");
  });
  test("responds with a 400 and a msg of bad request when id is not an id", async () => {
    const res = await request(app)
      .patch("/api/articles/notAnId")
      .send({ inc_votes: 5 })
      .expect(400);
    expect(res.body.msg).toBe("bad request");
  });
});

xdescribe("GET /api/users", () => {
  test("GET respond with an array of users", async () => {
    const res = await request(app).get("/api/users").expect(200);

    res.body.users.forEach(() => {
      expect.objectContaining({
        username: expect.any(String),
        name: expect.any(String),
        avatar_url: expect.any(String),
      });
    });
    expect(res.body.users.length).toBe(4);
  });
});

xdescribe("GET /api/articles", () => {
  test("GET respond with an array of articles with the comment_count", async () => {
    const res = await request(app).get("/api/articles").expect(200);
    expect(res.body.articles.length).toBe(12);
    res.body.articles.forEach((articles) => {
      expect(articles).toEqual({
        article_id: expect.any(Number),
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(Number),
      });
    });
  });
});

xdescribe("GET /api/articles/article_id/comments", () => {
  test("GET respond with an array of article comments", async () => {
    const res = await request(app).get("/api/articles/1/comments").expect(200);
    expect(res.body.comments.length).toBe(11);
    res.body.comments.forEach((comments) => {
      expect(comments).toEqual({
        comment_id: expect.any(Number),
        body: expect.any(String),
        votes: expect.any(Number),
        author: expect.any(String),
        article_id: 1,
        created_at: expect.any(String),
      });
    });
  });
  test("responds with a 404 status and msg of not found", async () => {
    const res = await request(app)
      .get("/api/articles/999/comments")
      .expect(404);
    expect(res.body.msg).toBe("not found");
  });
  test("responds with a 400 status and msg of bad request", async () => {
    const res = await request(app)
      .get("/api/articles/notAnId/comments")
      .expect(400);
    expect(res.body.msg).toBe("bad request");
  });
  test("GET respond with an array of article comments", async () => {
    const res = await request(app).get("/api/articles/3/comments").expect(200);
    expect(res.body.comments.length).toBe(2);
    res.body.comments.forEach((comments) => {
      expect(comments).toEqual({
        comment_id: expect.any(Number),
        body: expect.any(String),
        votes: expect.any(Number),
        author: expect.any(String),
        article_id: 3,
        created_at: expect.any(String),
      });
    });
  });
});

xdescribe("POST /api/articles/3/comments", () => {
  test("post a new comment under a username?", async () => {
    const requestBody = {
      body: "this is a comment",
      username: "icellusedkars",
    };
    const res = await request(app)
      .post("/api/articles/1/comments")
      .send(requestBody)
      .expect(201);
    expect(res.body.comment).toEqual({
      author: "icellusedkars",
      body: "this is a comment",
      votes: 0,
      article_id: 1,
      created_at: expect.any(String),
      comment_id: expect.any(Number),
    });
  });
  test("POST return 400 when body doesnt contain all required keys", async () => {
    const requestBody = {
      body: "this is a comment",
    };
    const res = await request(app)
      .post("/api/articles/1/comments")
      .send(requestBody)
      .expect(400);
    expect(res.body.msg).toEqual("invalid request");
  });
  test("responds with a 400 status and msg of bad request", async () => {
    const requestBody = {
      body: "this is a comment",
      username: "icellusedkars",
    };
    const res = await request(app)
      .post("/api/articles/notAnId/comments")
      .send(requestBody)
      .expect(400);
    expect(res.body.msg).toBe("bad request");
  });
  test("responds with a 400 status and msg of bad request", async () => {
    const requestBody = {
      body: "this is a comment",
      username: "notValidUsername",
    };
    const res = await request(app)
      .post("/api/articles/1/comments")
      .send(requestBody)
      .expect(400);
    expect(res.body.msg).toBe("bad request");
  });
});

xdescribe("DELETE", () => {
  test("204 delete the given comment id", async () => {
    const res = await request(app).delete("/api/comments/5").expect(204);
    expect(res.body.comment).toEqual();
    const secondRes = await request(app).get("/api/comments/5").expect(200);
    expect(secondRes.body.comment).toEqual([]);
  });
  test("204 delete the given comment id", async () => {
    const res = await request(app).delete("/api/comments/99999").expect(404);
    expect(res.body.msg).toBe("not found");
  });
  test("204 delete the given comment id", async () => {
    const res = await request(app).delete("/api/comments/notAnId").expect(400);
    expect(res.body.msg).toBe("bad request");
  });
});

describe("GET /api", () => {
  test("respond with the api", async () => {
    const res = await request(app).get("/api").expect(200);
    expect(res.body).toEqual(endPoints);
  });
});

describe("GET /api/articles (queries)", () => {
  test("GET respond with an array of articles sorted by descending order", async () => {
    const res = await request(app)
      .get("/api/articles?sort_by=title")
      .expect(200);
    expect(res.body.articles.length).toBe(12);
    expect(res.body.articles).toBeSorted("title");
    res.body.articles.forEach((articles) => {
      expect(articles).toEqual({
        article_id: expect.any(Number),
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(Number),
      });
    });
  });
  test("GET responds with the default column in ascending order", async () => {
    const res = await request(app).get("/api/articles?order=asc").expect(200);
    expect(res.body.articles.length).toBe(12);
    expect(res.body.articles).toBeSorted("created_by");
  });
  test("GET responds with the articles topic value", async () => {
    const res = await request(app).get("/api/articles?topic=cats").expect(200);
    expect(res.body.articles.length).toBe(1);
  });
  test("GET responds with an error when given an invalid column", async () => {
    const res = await request(app)
      .get("/api/articles?sort_by=invalidColumn")
      .expect(400);
    expect(res.body.msg).toBe("invalid request");
  });
  test("GET responds with an error when given an invalid column", async () => {
    const res = await request(app)
      .get("/api/articles?sort_by=invalidColumn")
      .expect(400);
    expect(res.body.msg).toBe("invalid request");
  });
  test("GET responds with an error when given an invalid column", async () => {
    const res = await request(app).get("/api/articles?order=hello").expect(400);
    expect(res.body.msg).toBe("bad request");
  });
  test("GET responds with the articles topic value", async () => {
    const res = await request(app)
      .get("/api/articles?topic=notATopic")
      .expect(400);
    expect(res.body.msg).toBe("invalid request");
  });
});
