const Preference = require("../models/preferenceSchema.js");
const Vendor = require("../models/vendorSchema.js");
const Guest = require("../models/guestSchema.js");

const preferenceCreate = async (req, res) => {
  try {
    const preferences = req.body.preferences.map((preference) => ({
      subName: preference.subName,
      subCode: preference.subCode,
      sessions: preference.sessions,
    }));

    const existingPreferenceBySubCode = await Preference.findOne({
      "preferences.subCode": preferences[0].subCode,
      event: req.body.adminID,
    });

    if (existingPreferenceBySubCode) {
      res.send({
        message: "Sorry this subcode must be unique as it already exists",
      });
    } else {
      const newPreferences = preferences.map((preference) => ({
        ...preference,
        stableName: req.body.stableName,
        event: req.body.adminID,
      }));

      const result = await Preference.insertMany(newPreferences);
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const allPreferences = async (req, res) => {
  try {
    let preferences = await Preference.find({ event: req.params.id }).populate(
      "stableName",
      "stableName"
    );
    if (preferences.length > 0) {
      res.send(preferences);
    } else {
      res.send({ message: "No preferences found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const tablePreferences = async (req, res) => {
  try {
    let preferences = await Preference.find({ stableName: req.params.id });
    if (preferences.length > 0) {
      res.send(preferences);
    } else {
      res.send({ message: "No preferences found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const freePreferenceList = async (req, res) => {
  try {
    let preferences = await Preference.find({
      stableName: req.params.id,
      vendor: { $exists: false },
    });
    if (preferences.length > 0) {
      res.send(preferences);
    } else {
      res.send({ message: "No preferences found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getPreferenceDetail = async (req, res) => {
  try {
    let preference = await Preference.findById(req.params.id);
    if (preference) {
      preference = await preference.populate("stableName", "stableName");
      preference = await preference.populate("vendor", "name");
      res.send(preference);
    } else {
      res.send({ message: "No preference found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deletePreference = async (req, res) => {
  try {
    const deletedPreference = await Preference.findByIdAndDelete(req.params.id);

    // Set the teachPreference field to null in vendors
    await Vendor.updateOne(
      { teachPreference: deletedPreference._id },
      { $unset: { teachPreference: "" }, $unset: { teachPreference: null } }
    );

    // Remove the objects containing the deleted preference from guests' examResult array
    await Guest.updateMany(
      {},
      { $pull: { examResult: { subName: deletedPreference._id } } }
    );

    // Remove the objects containing the deleted preference from guests' attendance array
    await Guest.updateMany(
      {},
      { $pull: { attendance: { subName: deletedPreference._id } } }
    );

    res.send(deletedPreference);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deletePreferences = async (req, res) => {
  try {
    const deletedPreferences = await Preference.deleteMany({
      event: req.params.id,
    });

    // Set the teachPreference field to null in vendors
    await Vendor.updateMany(
      {
        teachPreference: {
          $in: deletedPreferences.map((preference) => preference._id),
        },
      },
      { $unset: { teachPreference: "" }, $unset: { teachPreference: null } }
    );

    // Set examResult and attendance to null in all guests
    await Guest.updateMany(
      {},
      { $set: { examResult: null, attendance: null } }
    );

    res.send(deletedPreferences);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deletePreferencesByTable = async (req, res) => {
  try {
    const deletedPreferences = await Preference.deleteMany({
      stableName: req.params.id,
    });

    // Set the teachPreference field to null in vendors
    await Vendor.updateMany(
      {
        teachPreference: {
          $in: deletedPreferences.map((preference) => preference._id),
        },
      },
      { $unset: { teachPreference: "" }, $unset: { teachPreference: null } }
    );

    // Set examResult and attendance to null in all guests
    await Guest.updateMany(
      {},
      { $set: { examResult: null, attendance: null } }
    );

    res.send(deletedPreferences);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  preferenceCreate,
  freePreferenceList,
  tablePreferences,
  getPreferenceDetail,
  deletePreferencesByTable,
  deletePreferences,
  deletePreference,
  allPreferences,
};
