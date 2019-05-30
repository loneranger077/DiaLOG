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

    app.get("/login", function (req, res) {
        res.render("components/login", function (err, html) {
            fs.readFile(path.join(__dirname, "../../views/components/scripts/login.js"), "utf8", (err, data) => {
                if (err) throw err;
                res.render("template", {
                    title: "Login",
                    content: html,
                    scripts: data
                });
            });
        });
    });

    app.get("/createGroup", function (req, res) {
        res.render("components/createGroup", function (err, html) {
            res.render("template", {
                title: "Create a Group",
                content: html
            });
        });
    });


    app.get("/groups", function (req, res) {
        res.render("components/groups", function (err, html) {
            fs.readFile(path.join(__dirname, "../../views/components/scripts/groups.js"), "utf8", (err, data) => {
                if (err) throw err;
                res.render("template", {
                    title: "Groups",
                    content: html,
                    scripts: data
                });
            });
        });
    });

    app.get("/group/:group", function (req, res) {
        res.render("components/group", {groupID: req.params.group}, function (err, html) {
            fs.readFile(path.join(__dirname, "../../views/components/scripts/group.js"), "utf8", (err, data) => {
                if (err) throw err;
                res.render("template", {
                    title: "Group",
                    content: html,
                    scripts: data
                });
            });
        });
    });
};