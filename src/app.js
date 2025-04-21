const express = require("express");
const app = express();
app.get("/user", (req, res) => {
    res.send(
        {
            firstName: "Harsh",
            lastName: "Kumar"
        }
    )
})
app.post("/user", (req, res) => {
    res.send(
        "Data successfully saved to backend.."
    )
})
app.get("/hello", (req, res) => {
    res.send("Hello G. from /hello")
})
// app.use("/", (req, res) => {
//     res.send("Hello server from /.")
// })
app.listen(7777, () => {
    console.log("Server is running on port 7777");
});