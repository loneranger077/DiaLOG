const path = require("path");

module.exports = function (app) {

    require("./user.js")(app);
    require("./group.js")(app);
};