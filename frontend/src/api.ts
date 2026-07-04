export type Project = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
};

export type Task = {
  id: number;
  project_id: number;
  title: string;
  status: "todo" | "doing" | "done";
  created_at: string;
};

const API_BASE_URL = "http://localhost:4000/api";

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE_URL}/projects`);

  if (!response.ok) {
    throw new Error("Failed to load projects");
  }

  return response.json();
}

export async function createProject(name: string, description: string): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, description })
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
}

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Failed to load tasks");
  }

  return response.json();
}

export async function createTask(projectId: number, title: string): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ projectId, title })
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
}

export async function updateTaskStatus(
  taskId: number,
  status: Task["status"]
): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  return response.json();
}

export async function deleteTask(taskId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}