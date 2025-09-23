const bcrypt = require("bcrypt");
const validator = require("validator"); // for safe validation
const Vendor = require("../models/vendorSchema.js");
const { createNewToken } = require("../utils/token.js");

// ---------------------- Vendor Register ----------------------
const vendorRegister = async (req, res) => {
  try {
    const { email, shopName, password } = req.body;

    // Basic validation
    if (!email || !shopName || !password) {
      return res
        .status(400)
        .json({ message: "Email, shop name and password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (typeof shopName !== "string" || shopName.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Shop name must be at least 3 characters long" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Normalize inputs
    const normalizedEmail = validator.normalizeEmail(email);
    const cleanShopName = validator.escape(shopName.trim());

    // Check for existing vendor (safe queries)
    const existingVendorByEmail = await Vendor.findOne()
      .where("email")
      .equals(normalizedEmail);
    if (existingVendorByEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingShop = await Vendor.findOne()
      .where("shopName")
      .equals(cleanShopName);
    if (existingShop) {
      return res.status(400).json({ message: "Shop name already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Save vendor
    const vendor = new Vendor({
      email: normalizedEmail,
      shopName: cleanShopName,
      password: hashedPass
    });

    let result = await vendor.save();
    result.password = undefined;

    const token = createNewToken(result._id);
    res.status(201).json({ ...result._doc, token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ---------------------- Vendor Login ----------------------
const vendorLogIn = async (req, res) => {
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
    const vendor = await Vendor.findOne()
      .where("email")
      .equals(normalizedEmail);
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
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { vendorRegister, vendorLogIn };
