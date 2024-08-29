// TaskBoard.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
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
import TaskCreate from "./TaskCreate";
import TaskColumn from "./TaskColumn";
import { Task } from "../types";

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("createdAt");
  const token = localStorage.getItem("token");

  const fetchTasks = useCallback(async () => {
    if (token) {
      try {
        const response = await apiTaskService.fetchTasks(token);
        setTasks(response.data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragDrop = async (results: DropResult) => {
    console.log(results);
    const { source, destination, type, draggableId } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const updatedTasks = [...tasks];
      const sourceIndex = source.index;
      const destinationIndex = destination.index;
      const [removedTask] = updatedTasks.splice(sourceIndex, 1);
      removedTask.status = destination.droppableId.split("-")[0] as
        | "TODO"
        | "IN PROGRESS"
        | "DONE";
      updatedTasks.splice(destinationIndex, 0, removedTask);
      console.log("Task Removed: ", removedTask);
      await apiTaskService.updateTask(token!, removedTask._id, removedTask);
      const updatedTasksFromDB = (await apiTaskService.fetchTasks(token!)).data;
      console.log("newly fetched tasks: ", updatedTasksFromDB);
      return setTasks(updatedTasksFromDB);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(event.target.value);

  const handleSortChange = (event: SelectChangeEvent<string>) =>
    setSortOption(event.target.value);

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA =
        sortOption === "dueDate"
          ? new Date(a.dueDate ?? "")
          : new Date(a.createdAt);
      const dateB =
        sortOption === "dueDate"
          ? new Date(b.dueDate ?? "")
          : new Date(b.createdAt);
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="body1" align="left" gutterBottom>
        <TaskCreate onTaskCreated={fetchTasks} />
      </Typography>
      <Box boxShadow={2}
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
          {["TODO", "IN PROGRESS", "DONE"].map((status) => (
            <Grid key={status + new Date().getTime()} size={4}>
              <TaskColumn
                status={status as "TODO" | "IN PROGRESS" | "DONE"}
                tasks={filteredTasks.filter((task) => task.status === status)}
              />
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
    </Container>
  );
};

export default TaskBoard;
