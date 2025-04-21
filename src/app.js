const express = require("express");
const app = express();
app.use("/hi", (req, res) => {
    res.send("Hello from the server.")
})
app.listen(7777, () => {
    console.log("Server is running on port 7777");
});