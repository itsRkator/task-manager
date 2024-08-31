// CreateAndUpdateTask.tsx
import React, { useState, useCallback } from "react";
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
import { useNotification } from "../contexts/NotificationContext";
import { handleAuthError } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/getErrorMessageUtils";

const CreateAndUpdateTask: React.FC<TaskCreateProps> = ({
  onTaskCreateAndUpdate,
  buttonLabel,
  task,
}) => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    dueDate: task?.dueDate ? new Date(task.dueDate) : null,
    reminder: task?.reminder ? new Date(task.reminder) : null,
  });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      dueDate: null,
      reminder: null,
    });
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleDateChange = useCallback(
    (name: keyof typeof formData) => (date: Date | null) => {
      setFormData((prev) => ({ ...prev, [name]: date }));
    },
    []
  );

  const handleCreateOrUpdateTask = async () => {
    const { title, description, dueDate, reminder } = formData;

    try {
      if (!task?._id) {
        await apiTaskService.createTask(token, {
          title,
          description,
          dueDate,
          reminder,
        });
        onTaskCreateAndUpdate();
        showNotification("Task created successfully.", "success");
      } else {
        onTaskCreateAndUpdate(task?._id, title, description);
        showNotification("Task updated successfully.", "success");
      }
      handleClose();
    } catch (error: any) {
      console.error("Failed to save task", error);
      handleAuthError({
        error,
        showNotification,
        errorMessage: `An error occurred while saving the task. Please try again. Error: ${getErrorMessage(
          error
        )}`,
        navigate,
      });
    }
  };

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => {
    if (!task?._id) {
      resetForm();
    }
    setOpen(false);
  }, [resetForm, task?._id]);

  const isEditing = Boolean(task?._id);

  return (
    <>
      <Button
        sx={{ textTransform: "none" }}
        style={{ margin: "0.25rem" }}
        variant="contained"
        color="primary"
        size="small"
        onClick={handleOpen}
      >
        {buttonLabel}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {isEditing ? "Edit Task" : "Create a New Task"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
          />
          {!isEditing && (
            <>
              <div style={{ marginTop: "1rem" }}>
                <label htmlFor="due-date-picker">Due Date:</label>
                <DatePicker
                  id="due-date-picker"
                  selected={formData.dueDate}
                  onChange={handleDateChange("dueDate")}
                  dateFormat="MMMM d, yyyy"
                  isClearable
                  placeholderText="Select Due Date"
                />
              </div>
              <div style={{ marginTop: "1rem" }}>
                <label htmlFor="reminder-date-picker">Reminder:</label>
                <DatePicker
                  id="reminder-date-picker"
                  selected={formData.reminder}
                  onChange={handleDateChange("reminder")}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  isClearable
                  placeholderText="Set Reminder"
                />
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: "none" }}
            onClick={handleCreateOrUpdateTask}
            variant="contained"
          >
            {isEditing ? "Save" : "Create"}
          </Button>
          <Button sx={{ textTransform: "none" }} onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateAndUpdateTask;
