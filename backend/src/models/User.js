const mongoose = require("mongoose");

const defaultAvatarURL =
  "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?t=st=1725041453~exp=1725045053~hmac=be5fcdd487ee7dbbe38b6469e924f7d0de37e6fe7418a100e8521ecbcd1c4186&w=826";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  googleId: { type: String },
  googleToken: { type: String },
  googleTokenSecret: { type: String },
  avatar: { type: String, default: defaultAvatarURL },
});

module.exports = mongoose.model("User", userSchema);
