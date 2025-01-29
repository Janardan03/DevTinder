const express = require("express");
const bcrypt = require("bcrypt");
const validateSignUpData = require("../utils/validate");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {

    try{

        // you can also validate all this in schema
        validateSignUpData(req);
        const {firstName, lastName, emailId, password} = req.body;

        // now encrypt your paswords
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName, lastName, emailId, password: passwordHash,
        });

        await user.save();
        res.send("user added successfully");

    } catch(err) {
        res.status(400).send("Error saving the user : " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {

    try {

        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = user.validatePassword(password);
        if(isPasswordValid) {

            const token = await user.getJWT();
            res.cookie("token", token, {expires: new Date(Date.now() + 3600000)});
            res.send("User logged in successfully");
        } else {
            throw new Error("Invalid credentials");
        }

    } catch(err) {
        res.status(400).send("Error : " + err.message);
    }
});

module.exports = authRouter;