const path = require("path");
const bcrypt = require("bcrypt");

const db = require("../../models")

module.exports = function (app) {

    app.post("/api/users", function (req, res) {
        const user = req.body
        if (user.password !== user.passwordConfirm) return res.status(500).json({ error: { message: "Passwords do not match" } })
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

    app.post("/api/login", function (req, res) {
        const form = req.body
        db.User.findOne({
            where: {
                username: form.username
            }
        }).then((user) => {
            if (bcrypt.compareSync(form.password, user.password)){
                req.session.userID = user.id
                res.status(200).json({ success: true, uid: user.id })
            } else {
                res.status(404).send("Invalid username or password")
            }
        }).catch(error => {
            res.status(500).json({ error: error })
        })
    });

};