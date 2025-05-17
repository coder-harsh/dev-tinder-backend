const express = require('express')
const authRouter = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/user')

// signup api
authRouter.post("/signup", async (req, res) => {
    const { emailId, firstName, lastName, age, gender, skills } = req.body
    if (!req.body.lastName) {
        res.status(400).send("Please add last name");
        return;
    }
    try {
        const passwordHash = await bcrypt.hash(req.body.password, 2)
        const user = new User({
            firstName, lastName, age, gender, skills, password: passwordHash, emailId
        });
        await user.save();
        res.send("User Added Successfully");
    } catch (error) {
        res.status(400).send("Error saving the user:" + error.message)
    }
})

// login api
authRouter.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
    try {
        const user = await User.findOne({ emailId })
        if (!user) {
            throw new Error("Email not exist")
        }
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = await user.bycryptPS(password)
        if (isPasswordValid) {
            const token = await user.getJWT();
            console.log(token)
            res.cookie("token", token)
            res.send("Login successfully")
        }
        else {
            throw new Error("Password is incorrect..")
        }
    } catch (error) {
        console.log(error)
    }
})


//logout api
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Sucessfull")
})

module.exports = authRouter;