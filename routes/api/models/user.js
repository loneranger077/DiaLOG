const session = require(rootPath + "/session/sessionController")

const db = require(rootPath + "/models")

module.exports = function (app) {

    app.post("/api/users", function (req, res) {
        if (req.body.password !== req.body.passwordConfirm) return res.status(500).json({ error: { message: "Passwords do not match" } })
        db.User.create({
            username: req.body.username,
            password: req.body.password,
            active: true
        }).then(() => {
            session.activate(req, req.body.username, req.body.password).then((user) => {
                res.status(200).json({ success: true, user: user })
            })
        }).catch(error => {
            res.status(500).json({ error: error })
        })
    });

    app.post("/api/login", function (req, res) {
        session.activate(req, req.body.username, req.body.password).then((user) => {
            res.status(200).json({ success: true, user: user })
        }).catch(error => {
            res.status(500).json({ error: error })
        })
    });

    app.post("/api/logout", function (req, res) {
        session.destroy(req).then(success => {
            res.status(200).json({ success: success})
        }).catch(error => {
            res.status(500).json({ error: error })
        })
    });

    app.get("/api/session", function (req, res) {
        session.user(req).then(user => {
            res.status(200).json({ active: true, user: user.mapData })
        }).catch(error => {
            res.status(404).json((error) ? { error: error } : { active : false })
        })
    });

};