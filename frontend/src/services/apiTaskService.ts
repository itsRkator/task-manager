import axios from "axios";

const TASKS_API_URL = `${process.env.REACT_APP_API_URL}/tasks`;

const apiTaskService = {
  fetchTasks: (
    token: string,
    params: { search: string; sortBy: string; sortOrder: string }
  ) =>
    axios.get(`${TASKS_API_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    }),
  createTask: (token: string, taskData: any) =>
    axios.post(`${TASKS_API_URL}`, taskData, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateTask: (token: string, taskId: string, taskData: any) =>
    axios.put(`${TASKS_API_URL}/${taskId}`, taskData, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  deleteTask: (token: string, taskId: string) =>
    axios.delete(`${TASKS_API_URL}/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default apiTaskService;
