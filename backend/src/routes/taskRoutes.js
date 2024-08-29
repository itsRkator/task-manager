const express = require("express");

const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all Tasks
router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
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
  id = req.params.id;
  await Task.findOneAndDelete(id);
  res.status(204).end();
});

module.exports = router;
