const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  googleId: { type: String },
  avatar: { type: String, default: "default-avatar-url" },
});

module.exports = mongoose.model("User", userSchema);
