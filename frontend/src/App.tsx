import { useEffect, useMemo, useState } from "react";
import {
  createProject,
  createTask,
  deleteTask,
  getProjects,
  getTasks,
  updateTaskStatus,
  type Project,
  type Task
} from "./api";

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [selectedProjectId, setSelectedProjectId] = useState<number | "">("");
  const [taskTitle, setTaskTitle] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [projectData, taskData] = await Promise.all([
        getProjects(),
        getTasks()
      ]);

      setProjects(projectData);
      setTasks(taskData);

      if (projectData.length > 0 && selectedProjectId === "") {
        setSelectedProjectId(projectData[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const selectedProjectTasks = useMemo(() => {
    if (selectedProjectId === "") {
      return [];
    }

    return tasks.filter((task) => task.project_id === selectedProjectId);
  }, [tasks, selectedProjectId]);

  async function handleCreateProject(event: React.FormEvent) {
    event.preventDefault();

    if (!projectName.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      const newProject = await createProject(projectName, projectDescription);

      setProjects((previous) => [newProject, ...previous]);
      setSelectedProjectId(newProject.id);
      setProjectName("");
      setProjectDescription("");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    }
  }

  async function handleCreateTask(event: React.FormEvent) {
    event.preventDefault();

    if (selectedProjectId === "") {
      setError("Please select a project first");
      return;
    }

    if (!taskTitle.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      const newTask = await createTask(selectedProjectId, taskTitle);

      setTasks((previous) => [newTask, ...previous]);
      setTaskTitle("");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  }

  async function handleStatusChange(taskId: number, status: Task["status"]) {
    try {
      const updatedTask = await updateTaskStatus(taskId, status);

      setTasks((previous) =>
        previous.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  }

  async function handleDeleteTask(taskId: number) {
    try {
      await deleteTask(taskId);

      setTasks((previous) => previous.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
         
          <h1>TaskBoard</h1>
          
        </div>

        <div className="stats-card">
          <strong>{projects.length}</strong>
          <span>Projects</span>

          <strong>{tasks.length}</strong>
          <span>Tasks</span>
        </div>
      </section>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading data...</div>}

      <section className="grid">
        <div className="panel">
          <h2>Create Project</h2>

          <form onSubmit={handleCreateProject}>
            <label>
              Project name
              <input
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Example: Interview Preparation"
              />
            </label>

            <label>
              Description
              <textarea
                value={projectDescription}
                onChange={(event) => setProjectDescription(event.target.value)}
                placeholder="Short project description"
              />
            </label>

            <button type="submit">Add Project</button>
          </form>
        </div>

        <div className="panel">
          <h2>Create Task</h2>

          <form onSubmit={handleCreateTask}>
            <label>
              Select project
              <select
                value={selectedProjectId}
                onChange={(event) =>
                  setSelectedProjectId(Number(event.target.value))
                }
              >
                <option value="">Choose a project</option>

                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Task title
              <input
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                placeholder="Example: Revise Docker Compose"
              />
            </label>

            <button type="submit">Add Task</button>
          </form>
        </div>
      </section>

      <section className="board">
        <div className="board-header">
          <h2>Tasks</h2>

          <select
            value={selectedProjectId}
            onChange={(event) => setSelectedProjectId(Number(event.target.value))}
          >
            <option value="">Select project</option>

            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {selectedProjectTasks.length === 0 ? (
          <p className="empty">No tasks available for this project.</p>
        ) : (
          <div className="task-list">
            {selectedProjectTasks.map((task) => (
              <article key={task.id} className={`task-card ${task.status}`}>
                <div>
                  <h3>{task.title}</h3>
                  <p>Status: {task.status}</p>
                </div>

                <div className="task-actions">
                  <select
                    value={task.status}
                    onChange={(event) =>
                      handleStatusChange(task.id, event.target.value as Task["status"])
                    }
                  >
                    <option value="todo">todo</option>
                    <option value="doing">doing</option>
                    <option value="done">done</option>
                  </select>

                  <button
                    className="danger"
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;