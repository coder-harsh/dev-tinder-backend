const mongoose = require('mongoose');
const connectDB = async () => {
    // await mongoose.connect("mongodb+srv://harsh2aug:Harsh2024CM@devtinder.30dkwz9.mongodb.net/devtinderdb")
    await mongoose.connect("mongodb://localhost:27017/devtinderdb")
}
module.exports = connectDB;