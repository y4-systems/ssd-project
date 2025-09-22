const express = require("express");
const rateLimit = require("express-rate-limit");
const dataModel = require("../Models/DataModel");

const taskRoutes = express.Router();

// Per-route limiter
const taskLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: "Too many requests to Task API, please slow down." }
});

// GET all Tasks
taskRoutes.get("/getTask", taskLimiter, async (req, res) => {
  const { _id } = req.user;
  let task = await dataModel.findById(_id);
  if (!task) task = await new dataModel({ _id }).save();
  res.json(task.tasks);
});

// POST a new Task
taskRoutes.post("/postTask", taskLimiter, async (req, res) => {
  const { _id } = req.user;
  const newTask = req.body;
  await dataModel.findByIdAndUpdate({ _id }, { $push: { tasks: newTask } });
  res.json({ success: "Posted Successfully" });
});

// PATCH update Task
taskRoutes.patch("/updateTask/:id", taskLimiter, async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  await dataModel.findOneAndUpdate(
    { "tasks.id": id },
    { $set: { "tasks.$.done": done } },
    { new: true }
  );
  res.json({ success: "Updated successfully" });
});

// DELETE Task
taskRoutes.delete("/deleteTask/:id", taskLimiter, async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  await dataModel.findByIdAndUpdate(_id, { $pull: { tasks: { id } } });
  res.json({ success: "Deleted successfully" });
});

module.exports = taskRoutes;
