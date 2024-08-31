const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

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
app.use(helmet());
app.use(morgan("combined"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use(limiter);

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
