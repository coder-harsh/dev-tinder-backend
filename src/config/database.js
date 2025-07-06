const mongoose = require('mongoose');
const connectDB = async () => {
    // await mongoose.connect("mongodb+srv://harsh2aug:Harsh2024CM@devtinder.30dkwz9.mongodb.net/devtinderdb")
    await mongoose.connect("mongodb://harsh2august:HarshSoftwarebit2024@194.164.148.99:27017/mydatabase?authSource=admin")
}
module.exports = connectDB;