const express = require("express");

const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all Tasks with search and sorting
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search = "", sortBy = "createdAt", sortOrder = "asc" } = req.query;

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

    const tasks = await Task.find(searchQuery).sort(sortOptions);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// Create Task
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, dueDate, reminder } = req.body;

  const task = await Task.create({
    title,
    description,
    userId: req.user.id,
    dueDate,
    reminder,
  });

  res.status(201).json({ message: "Task created", task });
});

// Update task
router.put("/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  const { title, description, status, dueDate, reminder } = req.body;
  const task = await Task.findByIdAndUpdate(
    id,
    { title, description, status, dueDate, reminder },
    { new: true }
  );
  res.json(task);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  await Task.findOneAndDelete(id);
  res.status(204).end();
});

module.exports = router;
