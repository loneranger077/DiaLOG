const path = require("path");

module.exports = function (app, wss) {

    require("./api")(app);
    require("./html")(app);
    require("./ws/socket.js")(app, wss);

};