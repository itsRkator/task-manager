// TaskItem.tsx
import React, { useState, useCallback } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Paper, Typography, Box, Button } from "@mui/material";
import { TaskItemProps } from "../types";
import apiTaskService from "../services/apiTaskService";
import ViewTasDialog from "./ViewTasDialog";
import CreateAndUpdateTask from "./CreateAndUpdateTask";
import { useNotification } from "../contexts/NotificationContext";

const TaskItem: React.FC<TaskItemProps> = ({ task, index, refreshTask }) => {
  const { showNotification } = useNotification();
  const token = localStorage.getItem("token");
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  const updateTask = useCallback(
    async (id?: string, title?: string, description?: string) => {
      if (token && id && title && description) {
        try {
          await apiTaskService.updateTask(token, id, { title, description });
          refreshTask();
          showNotification("Task has been updated successfully.", "success");
        } catch (error) {
          console.error("Failed to update the task:", error);
          showNotification(
            "An error occurred while trying to update the task. Please try again.",
            "error"
          );
        }
      } else {
        showNotification(
          "Invalid input. Please check the task details.",
          "error"
        );
      }
    },
    [token, refreshTask, showNotification]
  );

  const viewTaskDialogHandler = useCallback(() => {
    setIsDialogOpened((prev) => !prev);
  }, []);

  const deleteTaskHandler = useCallback(
    async (taskId: string) => {
      if (token) {
        try {
          await apiTaskService.deleteTask(token, taskId); // Attempt to delete the task
          refreshTask(); // Refresh the tasks if deletion is successful
          showNotification("Task has been deleted successfully.", "success");
        } catch (error) {
          console.error("Failed to delete the task:", error); // Handle the error
          showNotification(
            "An error occurred while trying to delete the task. Please try again.",
            "error"
          );
        }
      }
    },
    [token, refreshTask, showNotification]
  );

  return (
    <>
      <ViewTasDialog
        task={task}
        handleDialog={viewTaskDialogHandler}
        isDialogOpened={isDialogOpened}
      />
      <Draggable draggableId={task._id} index={index}>
        {(provided) => (
          <Paper
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={{
              marginBottom: "1rem",
              padding: "1rem",
              background: "#d2e6fa",
            }}
          >
            <Typography variant="h6">{task.title}</Typography>
            <Box mt={1}>
              <Typography variant="body2">{task.description}</Typography>
              <Typography variant="body2">
                {task.dueDate
                  ? `Due: ${new Date(task.dueDate).toLocaleDateString()}`
                  : ""}
              </Typography>
            </Box>
            <Typography textAlign="right">
              <Button
                sx={{ textTransform: "none" }}
                size="small"
                variant="contained"
                color="error"
                onClick={() => deleteTaskHandler(task._id)}
              >
                Delete
              </Button>
              <CreateAndUpdateTask
                onTaskCreateAndUpdate={updateTask}
                task={task}
                buttonLabel="Edit"
              />
              <Button
                sx={{ textTransform: "none" }}
                size="small"
                variant="contained"
                color="primary"
                onClick={viewTaskDialogHandler}
              >
                View Details
              </Button>
            </Typography>
          </Paper>
        )}
      </Draggable>
    </>
  );
};

export default TaskItem;
