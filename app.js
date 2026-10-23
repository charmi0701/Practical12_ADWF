require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// In-memory data store for CI automated testing resilience
let tasks = [
  { id: "1", title: "Setup GitHub Actions Workflow", priority: "high", completed: true },
  { id: "2", title: "Automate Jest Test Runner", priority: "medium", completed: true }
];

// Health endpoint for CI pipeline healthchecks
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Practical 12: CI/CD Pipeline Task API",
    pipeline: "GitHub Actions CI",
    status: "active"
  });
});

app.get("/tasks", (_req, res) => {
  res.status(200).json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.status(200).json(task);
});

app.post("/tasks", (req, res) => {
  const { title, priority } = req.body;
  if (!title || String(title).trim() === "") {
    return res.status(400).json({ error: "Task title is required" });
  }

  const newTask = {
    id: String(Date.now()),
    title: title.trim(),
    priority: priority || "medium",
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.delete("/tasks/:id", (req, res) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Task not found" });
  const deleted = tasks.splice(idx, 1)[0];
  res.status(200).json({ message: "Task deleted successfully", id: deleted.id });
});

module.exports = app;
