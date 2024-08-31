const request = require("supertest");
const app = require("../../app"); // Ensure your app is properly exported
const mongoose = require("mongoose");
const path = require("path");
const User = require("../../models/User");

describe("User Routes", () => {
  let token;
  let userId;

  before(async () => {
    // Create a new user for testing
    const user = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123", // Assume password hashing is managed in the model
    });

    userId = user._id;

    // Assume we have a method to get a valid token for this user
    const res = await request(app).post("/api/auth/login").send({
      email: "john.doe@example.com",
      password: "password123",
    });
    token = res.body.token;
  });

  after(async () => {
    // Clean up test data after all tests have run
    await User.deleteMany({});
    mongoose.connection.close();
  });

  describe("GET /api/users/profile", () => {
    it("should fetch the user profile when authenticated", async () => {
      const res = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("user");
      expect(res.body.user).to.have.property("firstName", "John");
      expect(res.body.user).to.have.property("email", "john.doe@example.com");
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app).get("/api/users/profile");
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property(
        "message",
        "Authorization header missing"
      );
    });

    it("should return 404 if user is not found", async () => {
      // Remove the user from the database to simulate a non-existent user
      await User.deleteOne({ _id: userId });

      const res = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("message", "User not found");
    });
  });

  describe("POST /api/users/upload-avatar", () => {
    it("should update the user avatar when authenticated and file is provided", async () => {
      const res = await request(app)
        .post("/api/users/upload-avatar")
        .set("Authorization", `Bearer ${token}`)
        .attach("avatar", path.join(__dirname, "test-files", "avatar.jpg")); // Assuming you have a test image file
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property(
        "message",
        "Profile photo updated successfully."
      );
      expect(res.body).to.have.property("avatar");
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app)
        .post("/api/users/upload-avatar")
        .attach("avatar", path.join(__dirname, "test-files", "avatar.jpg"));
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property(
        "message",
        "Authorization header missing"
      );
    });

    it("should return 400 if no file is provided", async () => {
      const res = await request(app)
        .post("/api/users/upload-avatar")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(400);
      expect(res.body)
        .to.have.property("message")
        .that.includes("No file uploaded");
    });

    it("should return 404 if user is not found when uploading avatar", async () => {
      // Simulate a missing user by deleting from the database
      await User.deleteMany({});

      const res = await request(app)
        .post("/api/users/upload-avatar")
        .set("Authorization", `Bearer ${token}`)
        .attach("avatar", path.join(__dirname, "test-files", "avatar.jpg"));
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("message", "User not found");
    });

    it("should return 400 for invalid file type", async () => {
      const res = await request(app)
        .post("/api/users/upload-avatar")
        .set("Authorization", `Bearer ${token}`)
        .attach(
          "avatar",
          path.join(__dirname, "test-files", "invalid-file.txt")
        ); // Use a non-image file
      expect(res.status).to.equal(400);
      expect(res.body)
        .to.have.property("message")
        .that.includes("Invalid file type");
    });
  });
});
