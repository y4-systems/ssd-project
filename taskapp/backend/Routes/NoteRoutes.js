const express = require("express");
const rateLimit = require("express-rate-limit");
const dataModel = require("../Models/DataModel");

const noteRoutes = express.Router();

// Per-route limiter
const noteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: "Too many requests to Note API, please slow down." }
});

// GET all Notes
noteRoutes.get("/getNote", noteLimiter, async (req, res) => {
  const { _id } = req.user;
  let note = await dataModel.findById(_id);
  if (!note) note = await new dataModel({ _id }).save();
  res.json(note.notes);
});

// POST a new Note
noteRoutes.post("/postNote", noteLimiter, async (req, res) => {
  const { _id } = req.user;
  const note = req.body;
  await dataModel.findByIdAndUpdate({ _id }, { $push: { notes: note } });
  res.json({ success: "Posted Successfully" });
});

// PATCH update Note
noteRoutes.patch("/updateNote/:id", noteLimiter, async (req, res) => {
  const { id } = req.params;
  const { newText } = req.body;
  await dataModel.findOneAndUpdate(
    { "notes.id": id },
    { $set: { "notes.$.noteText": newText } },
    { new: true }
  );
  res.json({ success: "Updated successfully" });
});

// DELETE Note
noteRoutes.delete("/deleteNote/:id", noteLimiter, async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  await dataModel.findByIdAndUpdate(_id, { $pull: { notes: { id } } });
  res.json({ success: "Deleted successfully" });
});

module.exports = noteRoutes;
