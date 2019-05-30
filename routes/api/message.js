const path = require("path");
const sessionHelper = require("../../helpers/session.js")

const db = require("../../models")

module.exports = function (app) {

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

};