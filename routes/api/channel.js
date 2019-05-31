const path = require("path");
const sessionHelper = require("../../helpers/session.js")

const db = require("../../models")

module.exports = function (app) {

    app.post("/api/channels/:group", function (req, res) {
        if (!sessionHelper.active(req)) return res.status(400).json({error: "not logged in"})
        const channel = req.body
        db.Member.findOne({
            where: {
                group: req.params.group,
                user: sessionHelper.active(req)
            }
        }).then(member => {
            db.Channel.create({
                name: channel.name,
                description: channel.description,
                group: member.group
            }).then(channel => {
                res.status(200).json({ success: true, channel: channel.mapData })
            }).catch(err => {
                res.status(500).json({ error: error })
            })
        }).catch(err => {
            res.status(500).json({ error: error })
        })
    });

    app.get("/api/channels/:group", function (req, res) {
        if (!sessionHelper.active(req)) return res.status(400).json({ error: "not logged in" })
        const channel = req.body
        db.Member.findOne({
            where: {
                group: req.params.group,
                user: sessionHelper.active(req)
            }
        }).then(member => {
            db.Channel.findAll({
                where: {
                    group: member.group
                }
            }).then(channels => {
                res.status(200).json({ success: true, channels: channels.map(channel => {
                    return channel.mapData
                }) })
            }).catch(err => {
                res.status(500).json({ error: error })
            })
        }).catch(err => {
            res.status(500).json({ error: error })
        })
    });

};