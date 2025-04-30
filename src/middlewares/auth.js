adminauth = (req, res, next) => {
    console.log("Admin auth is getting checked...")
    token = "xyz";
    if (token !== "xyz") {
        res.status(401).send(
            "Admin not authenticated"
        )
    }
    else {
        next();
    }
}
module.exports = {
    adminauth
}