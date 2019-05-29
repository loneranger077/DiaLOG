const path = require("path");
const sessionHelper = require("../../helpers/session.js")

const db = require("../../models")

module.exports = function (app) {
    
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
            }).then(() => {
                res.status(200).json({ success: true })
            }).catch(error => {
                res.status(500).json({ error: error })
            });
            res.status(200).json({ success: true })
        }).catch(error => {
            res.status(500).json({ error: error })
        });
    });

    app.get("/api/groups", function (req, res) {
        if (!sessionHelper.active(req)) {
            return res.status(400).json({error: "is not logged in"});
        };
        sessionHelper.getGroups(req).then(function(groups) {
            const array = groups.map(function(group) {
                return {name: group.name, description: group.description}
            });
            return res.status(200).json({success: true})
        }).catch(error => {
            res.status(500).json({error: error})
        });
    }).catch(error => {
        res.status(500).json({error: error})
    });

};