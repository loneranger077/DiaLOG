const path = require("path");
const fs = require("fs");

module.exports = function (app) {

    app.get("/", function (req, res) {
        res.render("components/index", function (err, html) {
            res.render("template", {
                title: "Chat",
				content: html
            });
        });
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