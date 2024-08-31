const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { filterUser } = require("../utils/utilityFunctions");

const router = express.Router();

// Router for User Registration
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Respond with user info excluding password
    const userResp = filterUser(user);
    res.status(201).json({ message: "User created", user: userResp });
  } catch (err) {
    console.error(`Error creating user record: ${err}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route for user login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(`Error during login: ${err}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      let user = await User.findOne({ email: req.user.email });

      if (!user) {
        // Create a new user with a default password
        const hashedPassword = await bcrypt.hash(req.user.id, 10);
        user = await User.create({
          firstName: req.user.name.givenName,
          lastName: req.user.name.familyName,
          email: req.user.email,
          password: hashedPassword,
        });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
    } catch (err) {
      console.error(`Error in Google OAuth: ${err}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
