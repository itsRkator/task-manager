const mongoose = require("mongoose");

// Define the schema for a task
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["TODO", "IN PROGRESS", "DONE"],
      default: "TODO",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value === null || value >= Date.now();
        },
        message: "Due date cannot be in the past",
      },
    },
    reminder: {
      type: Date,
      validate: {
        validator: function (value) {
          return value === null || value >= Date.now();
        },
        message: "Reminder cannot be in the past",
      },
    },
  },
  { timestamps: true }
);

// Compile and export the model
module.exports = mongoose.model("Task", taskSchema);
