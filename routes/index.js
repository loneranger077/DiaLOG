const path = require("path");

module.exports = function (app) {

    const Sockets = require("./ws/socket.js");

    require("./api")(app, new Sockets(app));
    require("./html")(app);

};