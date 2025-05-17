const express = require("express")
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth")

requestRouter.post("/sentConnectionRequestion", userAuth, async (req, res) => {
    const user = req.user
    res.send(`Send connection request... by ${user.firstName}`)
})



module.exports = requestRouter;