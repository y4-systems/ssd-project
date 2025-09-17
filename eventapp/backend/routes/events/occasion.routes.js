const express = require("express");
const router = express.Router();
const Occasion = require("../../models/events/occasion.model");

//Get all occasions
router.get("/getalloccasions", async (req, res) => {
  try {
    const occasions = await Occasion.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      occasions,
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

// Add occasion
router.post("/addoccasion", async (req, res) => {
  try {
    const newoccasion = new Occasion(req.body);
    await newoccasion.save();
    res.status(200).json({
      status: true,
      message: "Occasion added successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

//Edit occasion
router.patch("/editoccasion", async (req, res) => {
  try {
    const occasion = await Occasion.findOne({ _id: req.body._id });
    occasion.name = req.body.name;
    occasion.image = req.body.image;
    occasion.location = req.body.location;
    occasion.rentPerHour = req.body.rentPerHour;
    occasion.category = req.body.category;
    occasion.capacity = req.body.capacity;

    await occasion.save();

    res.status(200).json({
      status: true,
      message: "Occasion details updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

//Delete occasion
//path parameter
router.delete("/deleteoccasion/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const occasion = await Occasion.findOne({ _id: id });

    if (occasion) {
      await Occasion.findOneAndDelete({ _id: id });
      res.status(200).json({
        status: true,
        message: "Occasion detail deleted Successfully",
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Occasion detail not found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      error,
    });
  }
});

//Get one occasion by occasion id
router.get("/getoneoccasion/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const occasion = await Occasion.findOne({ _id: id });
    if (occasion) {
      res.status(200).json({
        status: true,
        occasion,
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Occasion not found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      error,
    });
  }
});

module.exports = router;
