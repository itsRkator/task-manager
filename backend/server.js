const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");

const appRouter = require("./src/app");
const authRouter = require("./src/routes/authRoutes");
const taskRouter = require("./src/routes/taskRoutes");

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow requests from frontend
    credentials: true,
  })
);

// Passport configuration
require("./src/config/passport")(passport);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error(`Failed to connect database. Error: ${err}`));

// Passport middleware
app.use(passport.initialize());

// Test endpoint
app.get("/", (req, res) => {
  res.json({ message: "App is running." });
});

// API Routes
app.use("/api", appRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
