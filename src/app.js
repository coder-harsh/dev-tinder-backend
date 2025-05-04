const express = require("express");
const connectDB = require("./config/database");
var validator = require('validator');
const { validateSignupData } = require("./utils/validation")
const app = express();
const User = require("./models/user")
const bcrypt = require('bcrypt');


app.get("/useriid", (req, res) => {
    console.log(req.query)
    res.send(
        {
            firstName: "Harsh",
            lastName: "Kumar"
        }
    )
})
app.get("/hi", (req, res, next) => {
    console.log("Handling the hi route")
    res.send("Say Hi")
    next(); //error will come

}, (req, res) => {
    res.send("Second route handler") //will not execute as soon as it sends first response
    console.log("2nd response")
})
app.get("/use/:id", (req, res) => {
    console.log(req.params.id)
    res.send(
        {
            firstName: "Harsh",
            lastName: "Kumar"
        }
    )
})
const { adminauth } = require("./middlewares/auth")
app.use("/admin", adminauth)
app.get("/admin/getdata", (req, res, next) => {
    try {
        throw new Error("ghjdj")
        res.send(
            "Data successfully saved to backend.."
        )
    } catch (error) {
        res.status(500).send("There is an error. Contact Support Team.....")
    }
})
app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send("Something went wrong..")
    }
})
app.get("/hello", (req, res) => {
    res.send("Hello G. from /hello")
})
app.use(express.json()); //change json to object
app.post("/signup", async (req, res) => {
    const userObj = {
        firstName: "Harsh",
        lastName: "Kumar",
        emailId: "harshj7.net@gmail.com",
        password: "Harsh@80%"
    }
    //creating a new instance
    // const user = new User(userObj);
    // const user = new User({
    //     firstName: "Sachin",
    //     lastName: "Tendulkar",
    //     emailId: "virat@gmail.com",
    //     password: "Harsh@80%",
    //     _id: "666666634423225525533"
    // });
    console.log(req.body)
    const { emailId, firstName, lastName, age, gender, skills } = req.body
    if (!req.body.lastName) {
        res.status(400).send("Please add last name");
        return;
    }
    try {
        const passwordHash = await bcrypt.hash(req.body.password, 2)
        console.log(passwordHash)
        const user = new User({
            firstName, lastName, age, gender, skills, password: passwordHash, emailId
        });
        await user.save();
        res.send("User Added Successfully");
    } catch (error) {
        res.status(400).send("Error saving the user:" + error.message)
    }
})

//get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const users = await User.find({ emailId: userEmail });
        if (users.length === 0) {
            res.status(404).send("User not found");
        }
        else {
            res.status(200).json({
                success: true,
                message: "User data fetched successfully",
                data: users
            });
        }
    } catch (error) {
        res.status(400).send("Something went wrong...")
    }
})
//get one user by email
app.get("/one-user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        console.log(userEmail)
        const user = await User.findOne({ emailId: userEmail }); //find one return object or null //if dont pass anything it will giev the first document.
        if (!user) {
            res.status(404).send("User not found");
        }
        else {
            res.status(200).json({
                success: true,
                message: "User data fetched successfully",
                data: user
            });
        }
    } catch (error) {
        res.status(400).send("Something went wrong...")
    }
})
// get all users
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            users: users
        });
    } catch (error) {
        res.status(400).send("Something went wrong...")
    }
})

//delete one user
app.delete("/delete-user/:id", async (req, res) => {
    const userId = req.params.id
    console.log(userId)
    try {
        // const deletedUser = await User.findByIdAndDelete({ _id: userId })
        const deletedUser = await User.findByIdAndDelete(userId)
        console.log(deletedUser)
        if (!deletedUser) {
            res.status(404).send("User Not Found..")
        }
        res.status(200).send("User deleted successfully.")
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(400).send("Something went wrong...")
    }
})

//update data of one user
app.patch("/update-user/:id", async (req, res) => {
    const updateUserId = req.params.id
    const data = req.body;
    try {
        // if (!data) {
        //     res.status(404).send("No data found....")
        // }
        const allowedUpdates = ["age", "emailId", "password", "firstName"]
        const isUpdateAllowed = Object.keys(data).every((k) => {
            return allowedUpdates.includes(k)
        })
        console.log("Incoming update data:", data);
        if (!isUpdateAllowed) {
            // res.status(400).send("Update not allowed..")
            // return

            throw new Error("Update Not allowed....")
        }
        // if (!validator.isEmail(req.body.emailId)) {
        //     res.status(400).send("Email is not valid...")
        //     return
        // }
        validateSignupData(req);
        const updatedUserId = await User.findByIdAndUpdate(updateUserId, data, { returnDocument: "after", runValidators: true }) //after will return user after the update //default value is before.. //run schema validators in update as well.
        res.status(200).send(`User ${updatedUserId.firstName} updated successfully....`)
        console.log(updatedUserId.firstName)
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(400).send("Something went wrong...")
    }
})
//by email
app.patch("/updat-user/:email", async (req, res) => {
    const updateEmail = req.params.email
    const data = req.body;
    console.log("By Email...")
    try {
        if (!data) {
            res.status(404).send("No data found....")
        }
        const updatedUserId = await User.findOneAndUpdate({ emailId: updateEmail }, data, { new: true }) //after will return user after the update //default value is before.. //{ new: true } do the same work as return after
        res.status(200).send(`User ${updatedUserId.firstName} updated successfully....`)
        console.log(updatedUserId.firstName)
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(400).send("Something went wrong...")
    }
})
//login api
app.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
    try {
        const user = await User.findOne({ emailId })
        if (!user) {
            throw new Error("Email not exist")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.send("Login successfully")
        }
        else {
            throw new Error("Password is incorrect..")
        }
    } catch (error) {
        console.log(error)
    }
})
connectDB().then(() => {
    console.log("Database connection established...")
    app.listen(7777, () => {
        console.log("Server is running on port 7777");
    });
}).catch(err => {
    console.error("Database connection failed:", err);
});