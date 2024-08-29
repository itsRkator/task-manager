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
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ error: "Insufficient information provided" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password mismatch" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const userResp = filterUser(user);

    res.status(201).json({ message: "User created", user: userResp });
  } catch (err) {
    console.error(`Error Creating user record: ${err}`);
    res.status(400).json({ message: "Error Creating user record" });
  }
});

// Route for user login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ message: "Email and Password required" });
  }

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({ token });
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

      // If user doesn't exist, create a new user
      if (!user) {
        const hashedPassword = await bcrypt.hash(req.user.id, 10); // Use Google ID as a default password (you might want to improve this)
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


      res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
    } catch (err) {
      console.error(`Error in Google OAuth: ${err}`);
      res.status(400).json({ message: "Google OAuth failed" });
    }
  }
);

module.exports = router;
