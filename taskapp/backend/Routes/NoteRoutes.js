const express = require("express");
const rateLimit = require("express-rate-limit");
const dataModel = require("../Models/DataModel");

const noteRoutes = express.Router();

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
noteRoutes.get("/getNote", readLimiter, async (req, res) => {
  const { _id } = req.user;
  let note = await dataModel.findById(_id);
  if (!note) note = await new dataModel({ _id }).save();
  res.json(note.notes);
});

noteRoutes.post("/postNote", writeLimiter, async (req, res) => {
  const { _id } = req.user;
  const note = req.body;
  await dataModel.findByIdAndUpdate({ _id }, { $push: { notes: note } });
  res.json({ success: "Posted Successfully" });
});

noteRoutes.patch("/updateNote/:id", writeLimiter, async (req, res) => {
  const { id } = req.params;
  const { newText } = req.body;
  await dataModel.findOneAndUpdate(
    { "notes.id": id },
    { $set: { "notes.$.noteText": newText } },
    { new: true }
  );
  res.json({ success: "Updated successfully" });
});

noteRoutes.delete("/deleteNote/:id", writeLimiter, async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  await dataModel.findByIdAndUpdate(_id, { $pull: { notes: { id } } });
  res.json({ success: "Deleted successfully" });
});

module.exports = noteRoutes;
