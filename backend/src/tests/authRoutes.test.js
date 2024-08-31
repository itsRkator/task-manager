const request = require("supertest");
const app = require("../../app"); // Make sure your app is properly exported

describe("Auth Routes", () => {
  describe("POST /api/auth/register", () => {
    it("should create a new user when all fields are valid", async () => {
      const res = await request(app).post("/api/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("user");
    });

    it("should return 400 if passwords do not match", async () => {
      const res = await request(app).post("/api/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        confirmPassword: "password321",
      });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("error", "Passwords do not match");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return a token when email and password are correct", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("token");
    });
  });
});
