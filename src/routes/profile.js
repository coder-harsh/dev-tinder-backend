const express = require("express")
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const { validateEditProfileData } = require("../utils/validation")
const User = require("../models/user");
const bycrypt = require('bcrypt');
//profile api
profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(400).send("Error: " + error.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const updatedData = req.body;
        if (!validateEditProfileData(req)) {
            return res.status(400).send("Error: Invalid fields for edit profile")
        }
        const user = req.user;
        console.log(user);
        const userId = req.user._id;
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).send("Error: User not found")
        }
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(400).send("Error: " + error.message)

    }
})
profileRouter.patch("/profile/forgetPassword", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const newPasswrod = req.body.password;
        if (!newPasswrod) {
            return res.status(400).send("Error: Password is required")
        }
        const userId = req.user._id;
        const hashedPassword = await bycrypt.hash(newPasswrod, 10)
        const updatedUser = await User.findByIdAndUpdate({ _id: userId }, { password: hashedPassword }, { new: true, runValidators: true })
        if (!updatedUser) {
            res.status(404).send("User not found");
        };
        res.status(200).json({
            success: true,
            message: "Password updated successfully",
            data: updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(400).send("Error: " + error.message)

    }
});
module.exports = profileRouter