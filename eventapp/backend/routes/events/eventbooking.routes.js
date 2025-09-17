const express = require("express");
const router = express.Router();
const Eventbooking = require("../../models/events/eventbooking.model");
const Occasion = require("../../models/events/occasion.model");

//Book occasion
router.post("/bookoccasion", async (req, res) => {
  try {
    const neweventbooking = new Eventbooking(req.body);
    await neweventbooking.save();

    res.status(200).json({
      status: true,
      message: "Occasion booked successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

//get all eventbookings for admin
router.get("/getalleventbookings", async (req, res) => {
  try {
    const eventbookings = await Eventbooking.find()
      .populate(["occasion", "user"])
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      eventbookings,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

//get all eventbookings for user by user id
router.get("/getalleventbookings/:id", async (req, res) => {
  try {
    const userID = req.params.id;
    const eventbookings = await Eventbooking.find({ user: userID })
      .populate("occasion")
      .sort({ createdAt: -1 });

    if (eventbookings.length == 0) {
      return res.status(400).json({
        status: false,
        message: "No eventbookings found",
      });
    } else {
      res.status(200).json({
        status: true,
        eventbookings,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

//cancle eventbooking
router.delete("/deleteeventbooking/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const eventbooking = await Eventbooking.findById(id);

    if (!eventbooking) {
      return res.status(400).json({
        status: false,
        message: "Eventbooking not found",
      });
    } else {
      const occasion = await Occasion.findById(eventbooking.occasion);
      occasion.bookedTimeSlots.pull(eventbooking.bookedTimeSlots);
      await occasion.save();
      await Eventbooking.findByIdAndDelete(id);
    }

    res.status(200).json({
      status: true,
      message: "Eventbooking deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

//get all eventbookings for occasion by eventbooking id
router.get("/getoccasioneventbookings/:id", async (req, res) => {
  try {
    const occasionID = req.params.id;
    const eventbookings = await Eventbooking.find({ occasion: occasionID });
    var temp = [];
    for (var eventbooking of eventbookings) {
      if (eventbooking.eventbookingStatus == "Confirmed") {
        temp.push(eventbooking.bookedTimeSlots);
      }
    }
    if (eventbookings.length == 0) {
      return res.status(400).json({
        status: false,
        eventbookings: temp,
        message: "No eventbookings found",
      });
    } else {
      res.status(200).json({
        status: true,
        eventbookings: temp,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

//change eventbooking status to confirmed
router.patch("/confirmEventbooking/:id", async (req, res) => {
  try {
    const bookongID = req.params.id;

    const eventbooking = await Eventbooking.findById(bookongID);

    if (eventbooking) {
      eventbooking.eventbookingStatus = "Confirmed";
      await eventbooking.save();

      //save eventbooking time slots to occasion
      const occasion = await Occasion.findById(eventbooking.occasion);
      occasion.bookedTimeSlots.push(eventbooking.bookedTimeSlots);
      await occasion.save();
      return res.status(200).json({
        status: true,
        message: "Eventbooking confirmed",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Eventbooking not found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

//change eventbooking status to declined
router.patch("/declineEventbooking/:id", async (req, res) => {
  try {
    const bookongID = req.params.id;

    const eventbooking = await Eventbooking.findById(bookongID);

    if (eventbooking) {
      eventbooking.eventbookingStatus = "Declined";
      await eventbooking.save();
      return res.status(200).json({
        status: true,
        message: "Eventbooking declined",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Eventbooking not found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});
module.exports = router;
