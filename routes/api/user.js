const path = require("path");

const db = require("../../models")

module.exports = function (app) {

    app.post("/api/users", function (req, res) {
        const user = req.body
        if (user.password !== user.passwordConfirm) return res.status(500).json({ error: {message: "Passwords do not match"} })
        db.User.create({
            username: user.username,
            password: user.password,
            active: true
        }).then(() => {
            res.status(200).json({ success: true })
        }).catch(error => {
            res.status(500).json({ error: error })
        })
    });

    // app.patch("/api/user/:id", function (req, res) {
    // });

    // app.put("/api/user/:id", function (req, res) {
    // }); 

    // app.delete("/api/user/:username", function (req, res) {
    //     db.Product.destroy({
    //         where: {
    //             username: req.params.username
    //         }
    //     }).then((destroyedRows) => {
    //         if (destroyedRows > 0) res.status(200).json({ success: true })
    //         else res.status(404).send("No Product Found")
    //     }).catch(error => {
    //         res.status(500).json({ error: error })
    //     })
    // });

};