const session = require(rootPath + "/session/sessionController")

const db = require(rootPath + "/models")

module.exports = function (app, socket) {

    app.post("/api/messages/:channel", function (req, res) {
        session.user(req).then(sessionUser => {
            db.Channel.findOne({
                where: { id: req.params.channel },
                include: [{
                    model: db.Group,
                    include: [{
                        model: db.Member,
                        where: { user: sessionUser.id }
                    }]
                }]
            }).then(channel => {
                channel.createMessage({
                    body: req.body.body,
                    user: sessionUser.id,
                    group: channel.group
                }).then(message => {
                    socket.send("message", message.body, message.group, message.channel)
                    res.status(200).json({ success: true, message: message.mapData })
                })
            })
        }).catch(error => {
            res.status(500).json({ error: error })
        });
    });

    app.get("/api/messages/:channel", function (req, res) {
        session.user(req).then(sessionUser => {
            db.Message.findAll({
                include: [{
                    model: db.Channel,
                    where: { id: req.params.channel },
                    include: [{
                        model: db.Group,
                        include: [{
                            model: db.Member,
                            where: { user: sessionUser.id }
                        }]
                    }]
                }]
            }).then(messages => {
                res.status(200).json({
                    success: true, messages: messages.map(function (message) {
                        return message.mapData
                    })
                })
            })
        }).catch(error => {
            res.status(500).json({ error: error })
        });
    });

};