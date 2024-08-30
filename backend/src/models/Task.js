const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["TODO", "IN PROGRESS", "DONE"],
      default: "TODO",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: Date,
    remainder: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
