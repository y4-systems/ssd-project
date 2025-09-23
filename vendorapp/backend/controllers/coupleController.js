const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
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

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check for existing user
    const existingCouple = await Couple.findOne({ email });
    if (existingCouple) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Save new couple
    const couple = new Couple({
      email,
      name,
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

    const couple = await Couple.findOne({ email });
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

    const couple = await Couple.findByIdAndUpdate(
      id,
      { $set: req.body }, // prevents direct injection
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
