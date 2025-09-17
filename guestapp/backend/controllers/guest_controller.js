const bcrypt = require("bcrypt");
const Guest = require("../models/guestSchema.js");
const Preference = require("../models/preferenceSchema.js");

const guestRegister = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const existingGuest = await Guest.findOne({
      rollNum: req.body.rollNum,
      event: req.body.adminID,
      stableName: req.body.stableName,
    });

    if (existingGuest) {
      res.send({ message: "Seat Number already exists" });
    } else {
      const guest = new Guest({
        ...req.body,
        event: req.body.adminID,
        password: hashedPass,
      });

      let result = await guest.save();

      result.password = undefined;
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const guestLogIn = async (req, res) => {
  try {
    let guest = await Guest.findOne({
      rollNum: req.body.rollNum,
      name: req.body.guestName,
    });
    if (guest) {
      const validated = await bcrypt.compare(req.body.password, guest.password);
      if (validated) {
        guest = await guest.populate("event", "eventName");
        guest = await guest.populate("stableName", "stableName");
        guest.password = undefined;
        guest.examResult = undefined;
        guest.attendance = undefined;
        res.send(guest);
      } else {
        res.send({ message: "Invalid password" });
      }
    } else {
      res.send({ message: "Guest not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getGuests = async (req, res) => {
  try {
    let guests = await Guest.find({ event: req.params.id }).populate(
      "stableName",
      "stableName"
    );
    if (guests.length > 0) {
      let modifiedGuests = guests.map((guest) => {
        return { ...guest._doc, password: undefined };
      });
      res.send(modifiedGuests);
    } else {
      res.send({ message: "No guests found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getGuestDetail = async (req, res) => {
  try {
    let guest = await Guest.findById(req.params.id)
      .populate("event", "eventName")
      .populate("stableName", "stableName")
      .populate("examResult.subName", "subName")
      .populate("attendance.subName", "subName sessions");
    if (guest) {
      guest.password = undefined;
      res.send(guest);
    } else {
      res.send({ message: "No guest found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteGuest = async (req, res) => {
  try {
    const result = await Guest.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (error) {
    res.status(500).json(err);
  }
};

const deleteGuests = async (req, res) => {
  try {
    const result = await Guest.deleteMany({ event: req.params.id });
    if (result.deletedCount === 0) {
      res.send({ message: "No guests found to delete" });
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).json(err);
  }
};

const deleteGuestsByTable = async (req, res) => {
  try {
    const result = await Guest.deleteMany({ stableName: req.params.id });
    if (result.deletedCount === 0) {
      res.send({ message: "No guests found to delete" });
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).json(err);
  }
};

const updateGuest = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      res.body.password = await bcrypt.hash(res.body.password, salt);
    }
    let result = await Guest.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    result.password = undefined;
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateExamResult = async (req, res) => {
  const { subName, obligesObtained } = req.body;

  try {
    const guest = await Guest.findById(req.params.id);

    if (!guest) {
      return res.send({ message: "Guest not found" });
    }

    const existingResult = guest.examResult.find(
      (result) => result.subName.toString() === subName
    );

    if (existingResult) {
      existingResult.obligesObtained = obligesObtained;
    } else {
      guest.examResult.push({ subName, obligesObtained });
    }

    const result = await guest.save();
    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const guestAttendance = async (req, res) => {
  const { subName, status, date } = req.body;

  try {
    const guest = await Guest.findById(req.params.id);

    if (!guest) {
      return res.send({ message: "Guest not found" });
    }

    const preference = await Preference.findById(subName);

    const existingAttendance = guest.attendance.find(
      (a) =>
        a.date.toDateString() === new Date(date).toDateString() &&
        a.subName.toString() === subName
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      // Check if the guest has already attended the maximum number of sessions
      const attendedSessions = guest.attendance.filter(
        (a) => a.subName.toString() === subName
      ).length;

      if (attendedSessions >= preference.sessions) {
        return res.send({ message: "Maximum attendance limit reached" });
      }

      guest.attendance.push({ date, status, subName });
    }

    const result = await guest.save();
    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const clearAllGuestsAttendanceByPreference = async (req, res) => {
  const subName = req.params.id;

  try {
    const result = await Guest.updateMany(
      { "attendance.subName": subName },
      { $pull: { attendance: { subName } } }
    );
    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const clearAllGuestsAttendance = async (req, res) => {
  const eventId = req.params.id;

  try {
    const result = await Guest.updateMany(
      { event: eventId },
      { $set: { attendance: [] } }
    );

    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const removeGuestAttendanceByPreference = async (req, res) => {
  const guestId = req.params.id;
  const subName = req.body.subId;

  try {
    const result = await Guest.updateOne(
      { _id: guestId },
      { $pull: { attendance: { subName: subName } } }
    );

    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const removeGuestAttendance = async (req, res) => {
  const guestId = req.params.id;

  try {
    const result = await Guest.updateOne(
      { _id: guestId },
      { $set: { attendance: [] } }
    );

    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  guestRegister,
  guestLogIn,
  getGuests,
  getGuestDetail,
  deleteGuests,
  deleteGuest,
  updateGuest,
  guestAttendance,
  deleteGuestsByTable,
  updateExamResult,

  clearAllGuestsAttendanceByPreference,
  clearAllGuestsAttendance,
  removeGuestAttendanceByPreference,
  removeGuestAttendance,
};
