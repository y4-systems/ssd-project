const express = require("express");
const rateLimit = require("express-rate-limit");
const dataModel = require("../Models/DataModel");

const todoRoutes = express.Router();

// Rate limiters
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please slow down." }
});

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many modifications, please try again later." }
});

// Routes
todoRoutes.get("/getTodo", readLimiter, async (req, res) => {
  const { _id } = req.user;
  let todo = await dataModel.findById(_id);
  if (!todo) todo = await new dataModel({ _id }).save();
  res.json(todo.todos);
});

todoRoutes.post("/postTodo", writeLimiter, async (req, res) => {
  const { _id } = req.user;
  const todo = req.body;
  await dataModel.findByIdAndUpdate({ _id }, { $push: { todos: todo } });
  res.json({ success: "Posted Successfully" });
});

todoRoutes.patch("/updateTodo/:todoId", writeLimiter, async (req, res) => {
  const { todoId } = req.params;
  const { status } = req.body;
  await dataModel.findOneAndUpdate(
    { "todos.todoId": todoId },
    { $set: { "todos.$.status": status } },
    { new: true }
  );
  res.json({ success: "Updated successfully" });
});

todoRoutes.delete("/deleteTodo/:todoId", writeLimiter, async (req, res) => {
  const { _id } = req.user;
  const { todoId } = req.params;
  await dataModel.findByIdAndUpdate(_id, { $pull: { todos: { todoId } } });
  res.json({ success: "Deleted successfully" });
});

module.exports = todoRoutes;
