const validator = require("validator")
const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body
    if (!firstName) {
        throw new Error("Name is required..")
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid")
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter strong password..")
    }
    else if (!req.body) {
        throw new Error("No data is there...")
    }
}
const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl", "age", "skills"]
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isEditAllowed;
}

module.exports = {
    validateSignupData, validateEditProfileData
}