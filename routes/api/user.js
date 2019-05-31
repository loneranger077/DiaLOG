const path = require("path");
const sessionHelper = require("../../helpers/session.js")

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
        sessionHelper.verify(req, form.username, form.password).then((user) => {
            res.status(200).json({ success: true, uid: user })
        }).catch(error => {
            res.status(500).json({ error: error })
        })
    });

    app.post("/api/logout", function (req, res) {
        try {
            req.session.destroy()
            res.status(200).json({ success: true })
        }catch (error){
            res.status(500).json({ error: error })
        }
    });

};