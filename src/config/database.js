const mongoose = require('mongoose');
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://harsh2aug:Harsh2024CM@devtinder.30dkwz9.mongodb.net/devtinderdb")
}
module.exports = connectDB;