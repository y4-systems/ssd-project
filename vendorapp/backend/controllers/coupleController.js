const bcrypt = require('bcrypt');
const Couple = require('../models/coupleSchema.js');
const { createNewToken } = require('../utils/token.js');

const coupleRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const couple = new Couple({
            ...req.body,
            password: hashedPass
        });

        const existingcoupleByEmail = await Couple.findOne({ email: req.body.email });

        if (existingcoupleByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else {
            let result = await couple.save();
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

const coupleLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let couple = await Couple.findOne({ email: req.body.email });
        if (couple) {
            const validated = await bcrypt.compare(req.body.password, couple.password);
            if (validated) {
                couple.password = undefined;

                const token = createNewToken(couple._id)

                couple = {
                    ...couple._doc,
                    token: token
                };

                res.send(couple);
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

const getInvoiceDetail = async (req, res) => {
    try {
        let couple = await Couple.findById(req.params.id)
        if (couple) {
            res.send(couple.invoiceDetails);
        }
        else {
            res.send({ message: "No couple found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const invoiceUpdate = async (req, res) => {
    try {

        let couple = await Couple.findByIdAndUpdate(req.params.id, req.body,
            { new: true })

        return res.send(couple.invoiceDetails);

    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    coupleRegister,
    coupleLogIn,
    getInvoiceDetail,
    invoiceUpdate,
};
