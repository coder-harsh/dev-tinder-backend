const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userAuth = async (req, res, next) => {
    //read the token from req cookies and validate the token and find the user
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        const decodedObj = await jwt.verify(token, "dev@123321")
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User Not Found...")
        }
        req.user = user
        next()
    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }
}
module.exports = {
    userAuth
}