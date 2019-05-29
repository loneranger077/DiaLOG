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
        if (sessionHelper.active(req)){
            sessionHelper.getUser(req).then(user => {
                render({ username: user.username })
            })
        }else{
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
};