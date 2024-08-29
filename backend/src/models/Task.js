const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["TODO", "IN PROGRESS", "DONE"],
    default: "TODO",
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now() },
  dueDate: Date,
  remainder: Date,
});

module.exports = mongoose.model("Task", taskSchema);
