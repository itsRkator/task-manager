const express = require("express");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const router = express.Router();

// Public routes
router.use("/auth", authRoutes); // Public route for authentication

// Protected routes
router.use("/users", authMiddleware, userRoutes); // Authenticated users can access
router.use("/tasks", authMiddleware, taskRoutes); // Authenticated users can access

module.exports = router;
