const express = require("express");
const multer = require("multer");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { filterUser } = require("../utils/utilityFunctions");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    findById(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Get User profile
router.get("/profile", authMiddleware, async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const filteredUserObj = filterUser(user);
    res.json({
      message: "User fetched",
      Status: "Success",
      user: filteredUserObj,
    });
  } catch (err) {
    console.error(`Error Creating user record: ${err}`);
    res.status(400).json({ message: "Error fetching user record" });
  }
});

// Update User Avatar
router.post(
  "/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const id = req.user.id;
      const user = await User.findById(id);
      const previousAvatar = user.avatar;
      user.avatar = req.file.path;
      await user.save();
      res.json({ message: "Profile photo has changed.", avatar: user.avatar });
    } catch (err) {
      res.status(500).json({ message: "Error uploading avatar", error: err });
    }
  }
);

module.exports = router;
