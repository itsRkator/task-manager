export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "TODO" | "IN PROGRESS" | "DONE";
  createdAt: string;
  dueDate?: string;
  reminder?: string;
}

export interface TaskColumnProps {
  status: "TODO" | "IN PROGRESS" | "DONE";
  tasks: Task[];
  refreshTask: () => void;
}

export interface TaskCreateProps {
  buttonLabel: string;
  task?: Task;
  onTaskCreateAndUpdate: (
    id?: string,
    title?: string,
    description?: string
  ) => void; // Callback to refresh task list
}

export interface ToolbarProps {
  isAuthenticated: boolean;
}

export interface TaskItemProps {
  task: Task;
  index: number;
  refreshTask: () => void;
}
