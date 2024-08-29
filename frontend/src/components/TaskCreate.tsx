// TaskCreate.tsx
import React, { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TaskCreateProps } from "../types";
import apiTaskService from "../services/apiTaskService";

const TaskCreate: React.FC<TaskCreateProps> = ({ onTaskCreated }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [reminder, setReminder] = useState<Date | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  const handleCreateTask = async () => {
    try {
      const taskData = { title, description, dueDate, reminder };
      await apiTaskService.createTask(token ?? "", taskData);
      onTaskCreated();
      handleClose();
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant="contained" color="primary" size="large" onClick={handleOpen}>
        Add Task
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div style={{ marginTop: "1rem" }}>
            <label>Due Date:</label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              dateFormat="MMMM d, yyyy"
              isClearable
              placeholderText="Select Due Date"
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <label>Reminder:</label>
            <DatePicker
              selected={reminder}
              onChange={(date) => setReminder(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              isClearable
              placeholderText="Set Reminder"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateTask} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskCreate;
