const path = require("path");

module.exports = function (app) {

    app.get("/", function (req, res) {
        res.render("components/index", function (err, html) {
            res.render("template", {
                title: "watchPad",
                content: html
            });
        });
    });
};