const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator"); // safer email validation
const Couple = require("../models/coupleSchema.js");
const { createNewToken } = require("../utils/token.js");

// ---------------------- Couple Register ----------------------
const coupleRegister = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Input validation
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, password and name are required" });
    }

    // Use validator.js instead of regex
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Sanitize email (lowercase + trim to avoid duplicates)
    const normalizedEmail = validator.normalizeEmail(email);

    // Safe query: explicitly validated email
    const existingCouple = await Couple.findOne({ email: normalizedEmail });
    if (existingCouple) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Save new couple
    const couple = new Couple({
      email: normalizedEmail,
      name: validator.escape(name), // sanitize name to prevent injection in case it's shown in UI
      password: hashedPass
    });

    let result = await couple.save();
    result.password = undefined;

    const token = createNewToken(result._id);

    res.status(201).json({ ...result._doc, token });
  } catch (err) {
    console.error("Error in coupleRegister:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ---------------------- Couple Login ----------------------
const coupleLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const normalizedEmail = validator.normalizeEmail(email);

    // Safe query
    const couple = await Couple.findOne({ email: normalizedEmail });
    if (!couple) {
      return res.status(404).json({ message: "User not found" });
    }

    const validated = await bcrypt.compare(password, couple.password);
    if (!validated) {
      return res.status(400).json({ message: "Invalid password" });
    }

    couple.password = undefined;
    const token = createNewToken(couple._id);

    res.status(200).json({ ...couple._doc, token });
  } catch (err) {
    console.error("Error in coupleLogIn:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ---------------------- Get Invoice Detail ----------------------
const getInvoiceDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent NoSQL injection with ObjectId check
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const couple = await Couple.findById(id);
    if (!couple) {
      return res.status(404).json({ message: "No couple found" });
    }

    res.status(200).json(couple.invoiceDetails || []);
  } catch (err) {
    console.error("Error in getInvoiceDetail:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ---------------------- Update Invoice ----------------------
const invoiceUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Only allow updating invoiceDetails explicitly
    const updateData = {};
    if (req.body.invoiceDetails) {
      updateData.invoiceDetails = req.body.invoiceDetails;
    }

    const couple = await Couple.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!couple) {
      return res.status(404).json({ message: "Couple not found" });
    }

    res.status(200).json(couple.invoiceDetails || []);
  } catch (err) {
    console.error("Error in invoiceUpdate:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  coupleRegister,
  coupleLogIn,
  getInvoiceDetail,
  invoiceUpdate
};
