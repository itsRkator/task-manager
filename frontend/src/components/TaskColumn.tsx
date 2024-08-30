// TaskColumn.tsx
import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Droppable } from "react-beautiful-dnd";
import TaskItem from "./TaskItem";
import { TaskColumnProps } from "../types";

const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  tasks,
  refreshTask,
}) => {

  
  return (
    <Grid>
      <Droppable
        droppableId={status + "-" + Math.random().toString()}
        type="group"
      >
        {(provided) => (
          <Paper
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ padding: "1rem", minHeight: "500px" }}
          >
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              textAlign="left"
              fontSize={15}
              style={{
                background: "#1876d2",
                color: "#fff",
                fontWeight: "bold",
                padding: "0.5rem",
              }}
            >
              {status}
            </Typography>
            <Box>
              {tasks.map((task, index) => (
                <TaskItem
                  refreshTask={refreshTask}
                  key={task._id}
                  task={task}
                  index={index}
                />
              ))}
            </Box>
            {provided.placeholder}
          </Paper>
        )}
      </Droppable>
    </Grid>
  );
};

export default TaskColumn;
