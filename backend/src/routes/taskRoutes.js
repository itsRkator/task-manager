const express = require("express");
const Task = require("../models/Task");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Validation middleware
const taskValidationRules = () => [
  body("title").notEmpty().withMessage("Title is required"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),
  body("reminder")
    .optional()
    .isISO8601()
    .withMessage("Reminder must be a valid date"),
];

// Get all Tasks with search and sorting
router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      sortBy = "createdAt",
      sortOrder = "asc",
      limit = 10,
      page = 1,
    } = req.query;

    // Build the search query
    const searchQuery = {
      userId: req.user.id,
      title: { $regex: search, $options: "i" }, // Case-insensitive search
    };

    // Build the sort object
    const sortOptions = {};
    if (["createdAt", "dueDate"].includes(sortBy)) {
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    } else {
      sortOptions["createdAt"] = 1; // Default sort by createdAt if invalid sortBy
    }

    // Pagination options
    const skip = (page - 1) * limit;
    const tasks = await Task.find(searchQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalTasks = await Task.countDocuments(searchQuery);
    res.json({
      totalTasks,
      tasks,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTasks / limit),
    });
  } catch (error) {
    console.error(`Error fetching tasks: ${error}`);
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
});

// Create Task
router.post("/", taskValidationRules(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, dueDate, reminder } = req.body;
    const task = await Task.create({
      title,
      description,
      userId: req.user.id,
      dueDate,
      reminder,
    });
    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    console.error(`Error creating task: ${error}`);
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
});

// Update Task
router.put("/:id", taskValidationRules(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const { title, description, status, dueDate, reminder } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // Ensure user can only update their own tasks
      { title, description, status, dueDate, reminder },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error(`Error updating task: ${error}`);
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
});

// Delete Task
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id }); // Ensure user can only delete their own tasks

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(204).end();
  } catch (error) {
    console.error(`Error deleting task: ${error}`);
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
});

module.exports = router;
