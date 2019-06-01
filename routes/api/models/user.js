const path = require("path");
const sessionHelper = require(rootPath + "/session/sessionController")

const db = require(rootPath + "/models")

module.exports = function (app) {

    app.post("/api/users", function (req, res) {
        const user = req.body
        if (user.password !== user.passwordConfirm) return res.status(500).json({ error: { message: "Passwords do not match" } })
        db.User.create({
            username: user.username,
            password: user.password,
            active: true
        }).then(() => {
            sessionHelper.verify(req, user.username, user.password).then((user) => {
                res.status(200).json({ success: true, uid: user })
            }).catch(err => {
                res.status(500).json({ error: err })
            })
        }).catch(err => {
            res.status(500).json({ error: err })
        })
    });

    app.post("/api/login", function (req, res) {
        const form = req.body
        sessionHelper.verify(req, form.username, form.password).then((user) => {
            res.status(200).json({ success: true, uid: user })
        }).catch(err => {
            res.status(500).json({ error: err })
        })
    });

    app.post("/api/logout", function (req, res) {
        try {
            req.session.destroy()
            res.status(200).json({ success: true })
        } catch (err) {
            res.status(500).json({ error: err })
        }
    });

    app.get("/api/session", function (req, res) {
        try {
            if (!sessionHelper.active(req)) {
                res.status(200).json({ active: false })
            }else{
                res.status(200).json({ active: true })
            }
        } catch (err) {
            res.status(500).json({ error: err })
        }
    });

};