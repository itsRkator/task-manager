// TaskItem.tsx
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Paper, Typography, Box, Button } from "@mui/material";
import { TaskItemProps } from "../types";
import apiTaskService from "../services/apiTaskService";

const TaskItem: React.FC<TaskItemProps> = ({ task, index }) => {
  const token = localStorage.getItem("token");
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
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
              onClick={() => apiTaskService.deleteTask(token!, task._id)}
            >
              Delete
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={() => console.log(task._id)}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => console.log(task._id)}
            >
              View Details
            </Button>
          </Typography>
        </Paper>
      )}
    </Draggable>
  );
};

export default TaskItem;
