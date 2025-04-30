const express = require("express");
const app = express();
app.get("/user", (req, res) => {
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
app.get("/user/:id", (req, res) => {
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

app.listen(7777, () => {
    console.log("Server is running on port 7777");
});