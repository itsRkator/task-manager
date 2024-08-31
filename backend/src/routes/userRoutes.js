const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const { filterUser } = require("../utils/utilityFunctions");

const router = express.Router();

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, JPG, and PNG files are allowed.")
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Get User profile
router.get("/profile", async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const filteredUserObj = filterUser(user);
    res.json({
      message: "User profile fetched successfully",
      status: "success",
      user: filteredUserObj,
    });
  } catch (err) {
    console.error(`Error fetching user profile: ${err}`);
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: err.message });
  }
});

// Update User Avatar
router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally, delete the previous avatar file here if needed
    // fs.unlink(previousAvatarPath, (err) => { if (err) console.error(err); });

    user.avatar = req.file.path;
    await user.save();
    res.json({
      message: "Profile photo updated successfully.",
      avatar: user.avatar,
    });
  } catch (err) {
    console.error(`Error uploading avatar: ${err}`);
    res
      .status(500)
      .json({ message: "Error uploading avatar", error: err.message });
  }
});

module.exports = router;
