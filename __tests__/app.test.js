const db = require("../db/connection");
const app = require("../app");
const testdata = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const request = require("supertest");

afterAll(() => {
  return db.end;
});

beforeEach(() => {
  return seed(testdata);
});

describe("GET /api/topics", () => {
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
    const res = await request(app).get("/api/articles/2").expect(200);

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
});

describe("PATCH /api/articles/:article_id", () => {
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
});

describe("GET /api/users", () => {
  test("GET respond with an array of users", async () => {
    const res = await request(app).get("/api/users").expect(200);

    res.body.user.forEach(() => {
      expect.objectContaining({
        username: expect.any(String),
        name: expect.any(String),
        avatar_url: expect.any(String),
      });
    });
    expect(res.body.user.length).toBe(4);
  });
});

describe("GET /api/articles", () => {
  test("GET respond with an array of articles with the comment_count", async () => {
    const res = await request(app).get("/api/articles").expect(200);

    res.body.article.forEach(() => {
      expect.objectContaining({
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
