const path = require("path");
const sessionHelper = require(rootPath + "/session/sessionController")

const db = require(rootPath + "/models")

module.exports = function (app, sockets) {

    app.post("/api/members/:group", function (req, res) {
        if (!sessionHelper.active(req)) return res.status(400).json({ error: "not logged in" })
        const member = req.body
        db.User.findOne({
            where: {
                username: member.username
            }
        }).then(user => {
            db.Member.create({
                user: user.id,
                group: req.params.group
            }).then(member => {
                 member.getGroup().then(group => {
                     socketHelper.sendToUser("member", group.mapData, member.id, member.user, sockets)
                     res.status(200).json({ success: true, member: member.mapData })
                 })
            })
        }).catch(err => {
            res.status(500).json({ error: err })
        })
    });

    app.get("/api/members/:group", function (req, res) {
        if (!sessionHelper.active(req)) return res.status(400).json({ error: "not logged in" })
        const channel = req.body
        db.Member.findAll({
            where: {
                group: req.params.group
            }
        }).then(members => {
            res.status(200).json({
                success: true, members: members.map(member => {
                    return member.mapData
                })
            })
        }).catch(err => {
            res.status(500).json({ error: err })
        })
    });

};