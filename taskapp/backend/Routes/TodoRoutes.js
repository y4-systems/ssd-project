const express = require("express");
const rateLimit = require("express-rate-limit");
const dataModel = require("../Models/DataModel");

const todoRoutes = express.Router();

// Per-route limiter
const todoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per IP
  message: { error: "Too many requests to Todo API, please slow down." }
});

// GET all Todos
todoRoutes.get("/getTodo", todoLimiter, async (req, res) => {
  const { _id } = req.user;
  let todo = await dataModel.findById(_id);
  if (!todo) todo = await new dataModel({ _id }).save();
  res.json(todo.todos);
});

// POST a new Todo
todoRoutes.post("/postTodo", todoLimiter, async (req, res) => {
  const { _id } = req.user;
  const todo = req.body;
  await dataModel.findByIdAndUpdate({ _id }, { $push: { todos: todo } });
  res.json({ success: "Posted Successfully" });
});

// PATCH update Todo
todoRoutes.patch("/updateTodo/:todoId", todoLimiter, async (req, res) => {
  const { todoId } = req.params;
  const { status } = req.body;
  await dataModel.findOneAndUpdate(
    { "todos.todoId": todoId },
    { $set: { "todos.$.status": status } },
    { new: true }
  );
  res.json({ success: "Updated successfully" });
});

// DELETE Todo
todoRoutes.delete("/deleteTodo/:todoId", todoLimiter, async (req, res) => {
  const { _id } = req.user;
  const { todoId } = req.params;
  await dataModel.findByIdAndUpdate(_id, { $pull: { todos: { todoId } } });
  res.json({ success: "Deleted successfully" });
});

module.exports = todoRoutes;
