const path = require("path");
const sessionHelper = require("../../helpers/session.js")

const db = require("../../models")

module.exports = function (app) {

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
                res.status(200).json({ success: true, member: member.mapData })
            }).catch(err => {
                res.status(500).json({ error: err })
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