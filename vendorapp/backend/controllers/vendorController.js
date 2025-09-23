const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Vendor = require("../models/vendorSchema.js");
const { createNewToken } = require("../utils/token.js");

// ---------------------- Vendor Register ----------------------
const vendorRegister = async (req, res) => {
  try {
    const { email, shopName, password } = req.body;

    // Input validation
    if (!email || !shopName || !password) {
      return res
        .status(400)
        .json({ message: "Email, shop name and password are required" });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (typeof shopName !== "string" || shopName.length < 3) {
      return res
        .status(400)
        .json({ message: "Shop name must be at least 3 characters long" });
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Safe queries
    const existingVendorByEmail = await Vendor.findOne({ email });
    if (existingVendorByEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingShop = await Vendor.findOne({ shopName });
    if (existingShop) {
      return res.status(400).json({ message: "Shop name already exists" });
    }

    // Save new vendor
    const vendor = new Vendor({
      email,
      shopName,
      password: hashedPass
    });

    let result = await vendor.save();
    result.password = undefined;

    const token = createNewToken(result._id);

    res.status(201).json({ ...result._doc, token });
  } catch (err) {
    console.error("Error in vendorRegister:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ---------------------- Vendor Login ----------------------
const vendorLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ message: "User not found" });
    }

    const validated = await bcrypt.compare(password, vendor.password);
    if (!validated) {
      return res.status(400).json({ message: "Invalid password" });
    }

    vendor.password = undefined;
    const token = createNewToken(vendor._id);

    res.status(200).json({ ...vendor._doc, token });
  } catch (err) {
    console.error("Error in vendorLogIn:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { vendorRegister, vendorLogIn };
