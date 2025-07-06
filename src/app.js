const express = require("express");
const connectDB = require("./config/database");
const { validateSignupData } = require("./utils/validation")
const app = express();
const User = require("./models/user")
const bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser')

app.get("/hi", (req, res, next) => {
    console.log("Handling the hi route")
    res.send("Say Hi")
    next(); //error will come

}, (req, res) => {
    res.send("Second route handler") //will not execute as soon as it sends first response
    console.log("2nd response")
})
app.use(express.json()); //change json to object
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")

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

app.use("/api/auth", authRouter)
app.use("/api/profile", profileRouter)
app.use("/api/request", requestRouter)




/*
// signup api
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

profile api
app.get("/profile", userAuth, async (req, res) => {
    try {
        // const cookies = req.cookies;
        // const { token } = cookies
        // if (!token) {
        //     throw new Error("Invalid Token...")
        // }
        // //validate a token
        // const decodedMsg = await jwt.verify(token, "dev@123321")
        // console.log(decodedMsg)
        // const { _id } = decodedMsg;
        // console.log("LoggedIn user is:" + _id)
        // const user = await User.findById(_id)
        // if (!user) {
        //     throw new Error("User does not exist...")
        // }
        // console.log(cookies);
        const user = req.user;
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(400).send("Error: " + error.message)
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
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = await user.bycryptPS(password)
        if (isPasswordValid) {
            // const token = await jwt.sign({
            //     _id: user._id
            // }, "dev@123321", { expiresIn: "1d" })
            const token = await user.getJWT();  //we offloaded the logic in schema methods
            console.log(token)
            res.cookie("token", token)
            res.send("Login successfully")
        }
        else {
            throw new Error("Password is incorrect..")
        }
    } catch (error) {
        console.log(error)
    }
})
*/
app.use("/", (req, res) => {
    try {
        res.send("api is working....")
    } catch (error) {
        res.status(500).send(error)
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