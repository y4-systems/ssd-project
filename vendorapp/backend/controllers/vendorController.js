const bcrypt = require('bcrypt');
const Vendor = require('../models/vendorSchema.js');
const { createNewToken } = require('../utils/token.js');

const vendorRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const vendor = new Vendor({
            ...req.body,
            password: hashedPass
        });

        const existingVendorByEmail = await Vendor.findOne({ email: req.body.email });
        const existingShop = await Vendor.findOne({ shopName: req.body.shopName });

        if (existingVendorByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else if (existingShop) {
            res.send({ message: 'Shop name already exists' });
        }
        else {
            let result = await vendor.save();
            result.password = undefined;

            const token = createNewToken(result._id)

            result = {
                ...result._doc,
                token: token
            };

            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const vendorLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let vendor = await Vendor.findOne({ email: req.body.email });
        if (vendor) {
            const validated = await bcrypt.compare(req.body.password, vendor.password);
            if (validated) {
                vendor.password = undefined;

                const token = createNewToken(vendor._id)

                vendor = {
                    ...vendor._doc,
                    token: token
                };

                res.send(vendor);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

module.exports = { vendorRegister, vendorLogIn };
