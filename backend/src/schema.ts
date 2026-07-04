import { query } from "./db.js";

export async function createSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      title VARCHAR(150) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'todo',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}