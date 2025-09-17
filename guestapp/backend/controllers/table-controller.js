const Stable = require("../models/stableSchema.js");
const Guest = require("../models/guestSchema.js");
const Preference = require("../models/preferenceSchema.js");
const Vendor = require("../models/vendorSchema.js");

const stableCreate = async (req, res) => {
  try {
    const stable = new Stable({
      stableName: req.body.stableName,
      event: req.body.adminID,
    });

    const existingStableByName = await Stable.findOne({
      stableName: req.body.stableName,
      event: req.body.adminID,
    });

    if (existingStableByName) {
      res.send({ message: "Sorry this table name already exists" });
    } else {
      const result = await stable.save();
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const stableList = async (req, res) => {
  try {
    let stablees = await Stable.find({ event: req.params.id });
    if (stablees.length > 0) {
      res.send(stablees);
    } else {
      res.send({ message: "No stablees found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getStableDetail = async (req, res) => {
  try {
    let stable = await Stable.findById(req.params.id);
    if (stable) {
      stable = await stable.populate("event", "eventName");
      res.send(stable);
    } else {
      res.send({ message: "No table found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getStableGuests = async (req, res) => {
  try {
    let guests = await Guest.find({ stableName: req.params.id });
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

const deleteStable = async (req, res) => {
  try {
    const deletedTable = await Stable.findByIdAndDelete(req.params.id);
    if (!deletedTable) {
      return res.send({ message: "Table not found" });
    }
    const deletedGuests = await Guest.deleteMany({ stableName: req.params.id });
    const deletedPreferences = await Preference.deleteMany({
      stableName: req.params.id,
    });
    const deletedVendors = await Vendor.deleteMany({
      teachStable: req.params.id,
    });
    res.send(deletedTable);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteStablees = async (req, res) => {
  try {
    const deletedTablees = await Stable.deleteMany({ event: req.params.id });
    if (deletedTablees.deletedCount === 0) {
      return res.send({ message: "No tablees found to delete" });
    }
    const deletedGuests = await Guest.deleteMany({ event: req.params.id });
    const deletedPreferences = await Preference.deleteMany({
      event: req.params.id,
    });
    const deletedVendors = await Vendor.deleteMany({ event: req.params.id });
    res.send(deletedTablees);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  stableCreate,
  stableList,
  deleteStable,
  deleteStablees,
  getStableDetail,
  getStableGuests,
};
