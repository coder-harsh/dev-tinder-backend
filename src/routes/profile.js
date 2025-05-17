const express = require("express")
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth")

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

module.exports = profileRouter