import Task from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Every query is scoped by req.userId (set in auth middleware) so one user
// can never read or modify another user's tasks, even by guessing an ID.

export const getTasks = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { user: req.userId, ...(status && { status }) };
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.userId });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const task = await Task.create({ user: req.userId, title, description, status, dueDate });
  res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted" });
});
