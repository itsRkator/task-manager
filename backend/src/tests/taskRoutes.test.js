const request = require("supertest");
const app = require("../../app");

describe("Task Routes", () => {
  let token;

  before(async () => {
    // Assume we have a method to get a valid token
    const res = await request(app).post("/api/auth/login").send({
      email: "john.doe@example.com",
      password: "password123",
    });
    token = res.body.token;
  });

  describe("POST /api/tasks", () => {
    it("should create a new task when all fields are valid", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "New Task",
          description: "Task description",
        });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("task");
    });
  });

  describe("GET /api/tasks", () => {
    it("should return all tasks for the authenticated user", async () => {
      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("tasks");
    });
  });
});
