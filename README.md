# TaskBoard

A small full-stack project management application built with Node.js, TypeScript, React, PostgreSQL, and Docker. 

TaskBoard is a small full-stack project management application.
Users can create projects, add tasks under each project, update task status like todo, doing, or done, and delete tasks. The data is stored permanently in PostgreSQL. The whole project runs using Docker Compose with three services: frontend, backend, and database.

## Tech Stack

- React + TypeScript
- Node.js + Express + TypeScript
- PostgreSQL
- Docker Compose

## Features

- Create projects
- Create tasks under projects
- Update task status: todo, doing, done
- Delete tasks
- Persist data in PostgreSQL
- Run frontend, backend, and database using Docker Compose

## Project Structure

taskboard/
├── docker-compose.yml
├── backend/
│   └── Node.js + Express + TypeScript API
└── frontend/
    └── React + TypeScript UI


Run Locally
docker compose up --build

Frontend:
http://localhost:5173

Backend health check:
http://localhost:4000/health


API Endpoints:
Projects
  GET /api/projects
  POST /api/projects
Tasks
  GET /api/tasks
  POST /api/tasks
  PATCH /api/tasks/:id/status
  DELETE /api/tasks/:id
  
Docker Services
db: PostgreSQL database
backend: Node.js Express API
frontend: React Vite frontend
