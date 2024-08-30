// TaskItem.tsx
import React, { useState, useCallback } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Paper, Typography, Box, Button } from "@mui/material";
import { TaskItemProps } from "../types";
import apiTaskService from "../services/apiTaskService";
import ViewTasDialog from "./ViewTasDialog";
import CreateAndUpdateTask from "./CreateAndUpdateTask";

const TaskItem: React.FC<TaskItemProps> = ({ task, index, refreshTask }) => {
  const token = localStorage.getItem("token");
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  const updateTask = useCallback(
    async (id?: string, title?: string, description?: string) => {
      if (token && id && title && description) {
        await apiTaskService.updateTask(token, id, { title, description });
        refreshTask();
      }
    },
    [token, refreshTask]
  );

  const viewTaskDialogHandler = useCallback(() => {
    setIsDialogOpened((prev) => !prev);
  }, []);

  const deleteTaskHandler = useCallback(async () => {
    if (token) {
      await apiTaskService.deleteTask(token, task._id);
      refreshTask();
    }
  }, [token, task._id, refreshTask]);

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
                size="small"
                variant="contained"
                color="error"
                onClick={deleteTaskHandler}
              >
                Delete
              </Button>
              <CreateAndUpdateTask
                onTaskCreateAndUpdate={updateTask}
                task={task}
                buttonLabel="Edit"
              />
              <Button
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
