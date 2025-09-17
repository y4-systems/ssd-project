const bcrypt = require("bcrypt");
const Couple = require("../models/coupleSchema.js");

const coupleRegister = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const couple = new Couple({ name, email, password: hashedPass, role });

    const existingCoupleByEmail = await Couple.findOne({ email });

    if (existingCoupleByEmail) {
      res.send({ message: "Email already exists" });
    } else {
      let result = await couple.save();
      result.password = undefined;
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const coupleLogIn = async (req, res) => {
  try {
    let couple = await Couple.findOne({ email: req.body.email });
    if (couple) {
      const validated = await bcrypt.compare(
        req.body.password,
        couple.password
      );
      if (validated) {
        // couple = await couple.populate("teachPreference", "subName sessions")
        // couple = await couple.populate("event", "eventName")
        // couple = await couple.populate("teachStable", "stableName")
        couple.password = undefined;
        res.send(couple);
      } else {
        res.send({ message: "Invalid password" });
      }
    } else {
      res.send({ message: "Couple not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  coupleRegister,
  coupleLogIn,
};
