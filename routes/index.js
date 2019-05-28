const path = require("path");

module.exports = function (app) {

    require("./api")(app);
    require("./html")(app);

};