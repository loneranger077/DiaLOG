const path = require("path");
const sessionHelper = require("../../helpers/session.js")
const socketHelper = require("../../helpers/socket.js")

const db = require("../../models")

module.exports = function (app, sockets) {

    app.get("/api/messages/:channel", function (req, res) {
        if (!sessionHelper.active(req)) return res.status(400).json({ error: "not logged in" })
        db.Message.findAll({
            where: {
                channel: req.params.channel
            }
        }).then(messages => {
            res.status(200).json({
                success: true, messages: messages.map(message => {
                    return { id: message.id, body: message.body }
                })
            })
        }).catch(err => {
            res.status(500).json({ error: error })
        })
    });

    app.post("/api/messages/:channel", function (req, res) {
        if (!sessionHelper.active(req)) return res.status(400).json({ error: "not logged in" })
        const message = req.body
        db.Channel.findOne({
            where: {
                id: req.params.channel
            }
        }).then(channel => {
            db.Message.create({
                channel: channel.id,
                body: message.body,
                user: sessionHelper.active(req),
                group: channel.group
            }).then(message => {
                socketHelper.send("message", message.body, message.group, sockets)
                res.status(200).json({success: true, mid: message.id})
            }).catch(err => {
                res.status(500).json({ error: err })
            })
        }).catch(err => {
            res.status(500).json({ error: err })
        })
    });

};