const path = require("path");
const fs = require("fs");
const sessionHelper = require("../../helpers/session.js");

module.exports = function (app) {

    app.get("/", function (req, res) {
        function render(data) {
            res.render("components/index", data, function (err, html) {
                res.render("template", {
                    title: "Chat",
                    content: html
                });
            });
        }
        if (sessionHelper.active(req)) {
            sessionHelper.getUser(req).then(user => {
                sessionHelper.getGroups(req).then(groups => {
                    render({ username: user.username, groups: groups.map(group => {
                        return group.name
                    }).join(', ')})
                })
            })
        } else {
            render({ username: "Not logged in" })
        }
    });

    app.get("/app", function (req, res) {
        res.render("components/app", function (err, html) {
            fs.readFile(path.join(__dirname, "../../views/components/scripts/app.js"), "utf8", (err, data) => {
                if (err) throw err;
                res.render("template", {
                    title: "DiaLOG",
                    content: html,
                    scripts: data
                });
            });
        });
    });

};