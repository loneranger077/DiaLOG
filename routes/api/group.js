const path = require("path");
const sessionHelper = require("../../helpers/session.js")
const socketHelper = require("../../helpers/socket.js")

const db = require("../../models")

module.exports = function (app, sockets) {
    
    app.post("/api/groups", function (req, res) {
        if (!sessionHelper.active(req)) {
            return res.status(400).json({error: "is not logged in"});
        };
        db.Group.create({
            name: req.body.name,
            description: req.body.description,
            user: sessionHelper.active(req)
        }).then((group) => {
            db.Member.create({
                group: group.id,
                user: group.user
            }).then((member) => {
                member.getGroup().then(group => {
                    socketHelper.sendToUser("member", group.mapData, member.id, member.user, sockets)
                    res.status(200).json({ success: true, group: group.mapData })
                })
            }).catch(err => {
                res.status(500).json({ error: err })
            });
        }).catch(err => {
            res.status(500).json({ error: err })
        });
    });

    app.get("/api/groups", function (req, res) {
        if (!sessionHelper.active(req)) {
            return res.status(400).json({ error: "is not logged in" });
        };
        sessionHelper.getGroups(req).then(function (groups) {
            const array = groups.map(function (group) {
                return group.mapData
            });
            res.status(200).json({ success: true, groups: array })
        }).catch(err => {
            res.status(500).json({ error: err })
        });
    })

};