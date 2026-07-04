import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createSchema } from "./schema.js";
import projectRoutes from "./routes/projects.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "taskboard-backend"
  });
});

app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

async function startServer() {
  try {
    await createSchema();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();