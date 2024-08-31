// TaskBoard.tsx
import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import apiTaskService from "../services/apiTaskService";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import debounce from "lodash.debounce";

import TaskColumn from "./TaskColumn";
import { Task } from "../types";
import CreateAndUpdateTask from "./CreateAndUpdateTask";
import { useNotification } from "../contexts/NotificationContext";
import { handleAuthError } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/getErrorMessageUtils";

const TaskBoard: React.FC = () => {
  const { showNotification } = useNotification();
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchParams, setSearchParams] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("createdAt");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    if (token) {
      try {
        const response = await apiTaskService.fetchTasks(token, {
          search: searchParams,
          sortBy: sortOption,
          sortOrder: "asc",
        });
        const tasks = response.data.tasks;
        if (tasks.length === 0) {
          showNotification("You have no any task schedule.", "success");
        }
        setTodoTasks(tasks.filter((task: Task) => task.status === "TODO"));
        setInProgressTasks(
          tasks.filter((task: Task) => task.status === "IN PROGRESS")
        );
        setDoneTasks(tasks.filter((task: Task) => task.status === "DONE"));
      } catch (error: any) {
        console.error("Failed to fetch tasks", error);
        handleAuthError({
          error,
          showNotification,
          errorMessage: `Failed to fetch tasks. Please try again later. Error: ${getErrorMessage(
            error
          )}`,
          navigate,
        });
      }
    } else {
      showNotification("No token available. Please log in.", "error");
    }
  }, [token, searchParams, sortOption, showNotification, navigate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragDrop = async (results: DropResult) => {
    const { source, destination, type } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const sourceStatus = source.droppableId.split("-")[0];
      const destinationStatus = destination.droppableId.split("-")[0];

      const sourceIndex = source.index;
      const destinationIndex = destination.index;
      let removedTask;

      const updatedTodoTasks = [...todoTasks];
      const updatedInProgressTasks = [...inProgressTasks];
      const updatedDoneTasks = [...doneTasks];

      try {
        if (sourceStatus === "TODO") {
          removedTask = updatedTodoTasks.splice(sourceIndex, 1)[0];
        } else if (sourceStatus === "IN PROGRESS") {
          removedTask = updatedInProgressTasks.splice(sourceIndex, 1)[0];
        } else if (sourceStatus === "DONE") {
          removedTask = updatedDoneTasks.splice(sourceIndex, 1)[0];
        }

        if (removedTask) {
          if (destinationStatus === "TODO") {
            updatedTodoTasks.splice(destinationIndex, 0, removedTask);
            setTodoTasks(updatedTodoTasks);
          } else if (destinationStatus === "IN PROGRESS") {
            updatedInProgressTasks.splice(destinationIndex, 0, removedTask);
            setInProgressTasks(updatedInProgressTasks);
          } else if (destinationStatus === "DONE") {
            updatedDoneTasks.splice(destinationIndex, 0, removedTask);
            setDoneTasks(updatedDoneTasks);
          }

          removedTask.status = destinationStatus as
            | "TODO"
            | "IN PROGRESS"
            | "DONE";

          if (token) {
            await apiTaskService.updateTask(
              token,
              removedTask._id,
              removedTask
            );
          }
          showNotification("Task moved successfully.", "success");
        }

        // Refresh tasks to reflect the changes
        fetchTasks();
      } catch (error: any) {
        console.error("Failed to update task status", error);
        handleAuthError({
          error,
          showNotification,
          errorMessage: `Failed to move task. Please try again later. Error: ${getErrorMessage(
            error
          )}`,
          navigate,
        });
      }
    }
  };

  const debouncedSearch = debounce((query: string) => {
    // Call the API or handle the search logic here
    setSearchParams(query);
  }, 300); // Adjust the debounce delay (300 ms) as needed

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      setSearchQuery(query);
      debouncedSearch(query);
    },
    [debouncedSearch] // Include debouncedSearch as a dependency
  );

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOption(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="body1" align="left" gutterBottom>
        <CreateAndUpdateTask
          onTaskCreateAndUpdate={fetchTasks}
          buttonLabel="Add Task"
        />
      </Typography>
      <Box
        boxShadow={2}
        padding={1.5}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <TextField
          style={{ marginLeft: "1rem", width: "50%" }}
          size="small"
          label="Search Tasks"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
        />
        <Typography sx={{ flexGrow: 1 }} />
        <FormControl variant="outlined">
          <InputLabel>Sort By</InputLabel>
          <Select
            size="small"
            value={sortOption}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="createdAt">Recent</MenuItem>
            <MenuItem value="dueDate">Due Date</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <DragDropContext onDragEnd={handleDragDrop}>
        <Grid container spacing={3}>
          <Grid key={"TODO"} size={4}>
            <TaskColumn
              refreshTask={fetchTasks}
              status={"TODO"}
              tasks={todoTasks}
            />
          </Grid>
          <Grid key={"IN PROGRESS"} size={4}>
            <TaskColumn
              refreshTask={fetchTasks}
              status={"IN PROGRESS"}
              tasks={inProgressTasks}
            />
          </Grid>
          <Grid key={"DONE"} size={4}>
            <TaskColumn
              refreshTask={fetchTasks}
              status={"DONE"}
              tasks={doneTasks}
            />
          </Grid>
        </Grid>
      </DragDropContext>
    </Container>
  );
};

export default TaskBoard;
