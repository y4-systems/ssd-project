const bcrypt = require("bcrypt");
const Vendor = require("../models/vendorSchema.js");
const Preference = require("../models/preferenceSchema.js");

const vendorRegister = async (req, res) => {
  const { name, email, password, role, event, teachPreference, teachStable } =
    req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const vendor = new Vendor({
      name,
      email,
      password: hashedPass,
      role,
      event,
      teachPreference,
      teachStable,
    });

    const existingVendorByEmail = await Vendor.findOne({ email });

    if (existingVendorByEmail) {
      res.send({ message: "Email already exists" });
    } else {
      let result = await vendor.save();
      await Preference.findByIdAndUpdate(teachPreference, {
        vendor: vendor._id,
      });
      result.password = undefined;
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const vendorLogIn = async (req, res) => {
  try {
    let vendor = await Vendor.findOne({ email: req.body.email });
    if (vendor) {
      const validated = await bcrypt.compare(
        req.body.password,
        vendor.password
      );
      if (validated) {
        vendor = await vendor.populate("teachPreference", "subName sessions");
        vendor = await vendor.populate("event", "eventName");
        vendor = await vendor.populate("teachStable", "stableName");
        vendor.password = undefined;
        res.send(vendor);
      } else {
        res.send({ message: "Invalid password" });
      }
    } else {
      res.send({ message: "Vendor not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getVendors = async (req, res) => {
  try {
    let vendors = await Vendor.find({ event: req.params.id })
      .populate("teachPreference", "subName")
      .populate("teachStable", "stableName");
    if (vendors.length > 0) {
      let modifiedVendors = vendors.map((vendor) => {
        return { ...vendor._doc, password: undefined };
      });
      res.send(modifiedVendors);
    } else {
      res.send({ message: "No vendors found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getVendorDetail = async (req, res) => {
  try {
    let vendor = await Vendor.findById(req.params.id)
      .populate("teachPreference", "subName sessions")
      .populate("event", "eventName")
      .populate("teachStable", "stableName");
    if (vendor) {
      vendor.password = undefined;
      res.send(vendor);
    } else {
      res.send({ message: "No vendor found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateVendorPreference = async (req, res) => {
  const { vendorId, teachPreference } = req.body;
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { teachPreference },
      { new: true }
    );

    await Preference.findByIdAndUpdate(teachPreference, {
      vendor: updatedVendor._id,
    });

    res.send(updatedVendor);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteVendor = async (req, res) => {
  try {
    const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);

    await Preference.updateOne(
      { vendor: deletedVendor._id, vendor: { $exists: true } },
      { $unset: { vendor: 1 } }
    );

    res.send(deletedVendor);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteVendors = async (req, res) => {
  try {
    const deletionResult = await Vendor.deleteMany({ event: req.params.id });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: "No vendors found to delete" });
      return;
    }

    const deletedVendors = await Vendor.find({ event: req.params.id });

    await Preference.updateMany(
      {
        vendor: { $in: deletedVendors.map((vendor) => vendor._id) },
        vendor: { $exists: true },
      },
      { $unset: { vendor: "" }, $unset: { vendor: null } }
    );

    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteVendorsByTable = async (req, res) => {
  try {
    const deletionResult = await Vendor.deleteMany({
      stableName: req.params.id,
    });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: "No vendors found to delete" });
      return;
    }

    const deletedVendors = await Vendor.find({ stableName: req.params.id });

    await Preference.updateMany(
      {
        vendor: { $in: deletedVendors.map((vendor) => vendor._id) },
        vendor: { $exists: true },
      },
      { $unset: { vendor: "" }, $unset: { vendor: null } }
    );

    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
  }
};

const vendorAttendance = async (req, res) => {
  const { status, date } = req.body;

  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.send({ message: "Vendor not found" });
    }

    const existingAttendance = vendor.attendance.find(
      (a) => a.date.toDateString() === new Date(date).toDateString()
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      vendor.attendance.push({ date, status });
    }

    const result = await vendor.save();
    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  vendorRegister,
  vendorLogIn,
  getVendors,
  getVendorDetail,
  updateVendorPreference,
  deleteVendor,
  deleteVendors,
  deleteVendorsByTable,
  vendorAttendance,
};
