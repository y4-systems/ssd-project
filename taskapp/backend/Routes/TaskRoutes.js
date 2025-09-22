const express = require("express");
const rateLimit = require("express-rate-limit");
const dataModel = require("../Models/DataModel");

const taskRoutes = express.Router();

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
taskRoutes.get("/getTask", readLimiter, async (req, res) => {
  const { _id } = req.user;
  let task = await dataModel.findById(_id);
  if (!task) task = await new dataModel({ _id }).save();
  res.json(task.tasks);
});

taskRoutes.post("/postTask", writeLimiter, async (req, res) => {
  const { _id } = req.user;
  const newTask = req.body;
  await dataModel.findByIdAndUpdate({ _id }, { $push: { tasks: newTask } });
  res.json({ success: "Posted Successfully" });
});

taskRoutes.patch("/updateTask/:id", writeLimiter, async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  await dataModel.findOneAndUpdate(
    { "tasks.id": id },
    { $set: { "tasks.$.done": done } },
    { new: true }
  );
  res.json({ success: "Updated successfully" });
});

taskRoutes.delete("/deleteTask/:id", writeLimiter, async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  await dataModel.findByIdAndUpdate(_id, { $pull: { tasks: { id } } });
  res.json({ success: "Deleted successfully" });
});

module.exports = taskRoutes;
