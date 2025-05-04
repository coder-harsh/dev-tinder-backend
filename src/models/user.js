const mongoose = require("mongoose");
var validator = require('validator');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true, //if required true and default is there. even if firstName not there it will store defult name
        default: "No name",
        minLength: 4
    },
    lastName: {
        type: String,
        lowercase: true,
    },
    emailId: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email Not Valid")
            }
        }
    },
    password: {
        type: String
    },
    age: {
        type: Number,
        min: 18,
        max: 60
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender Not Valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
    },
    about: {
        type: String,
        default: "This is the default description about the user"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt
});

const User = mongoose.model("User", userSchema);
module.exports = User;