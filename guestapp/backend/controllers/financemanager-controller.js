const bcrypt = require("bcrypt");
const FinanceManager = require("../models/financeManagerSchema.js");

const financeManagerRegister = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const financeManager = new FinanceManager({
      name,
      email,
      password: hashedPass,
      role,
    });

    const existingFinanceManagerByEmail = await FinanceManager.findOne({
      email,
    });

    if (existingFinanceManagerByEmail) {
      res.send({ message: "Email already exists" });
    } else {
      let result = await financeManager.save();
      result.password = undefined;
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const financeManagerLogIn = async (req, res) => {
  try {
    let financeManager = await FinanceManager.findOne({
      email: req.body.email,
    });
    if (financeManager) {
      const validated = await bcrypt.compare(
        req.body.password,
        financeManager.password
      );
      if (validated) {
        // financeManager = await financeManager.populate("teachPreference", "subName sessions")
        // financeManager = await financeManager.populate("event", "eventName")
        // financeManager = await financeManager.populate("teachStable", "stableName")
        financeManager.password = undefined;
        res.send(financeManager);
      } else {
        res.send({ message: "Invalid password" });
      }
    } else {
      res.send({ message: "FinanceManager not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  financeManagerRegister,
  financeManagerLogIn,
};
