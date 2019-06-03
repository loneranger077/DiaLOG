const socketController = require("../sockets/socketController");

module.exports = function (app, sockets) {

    require("./api/apiRoutes")(app, new socketController(sockets));
    require("./html/htmlRoutes")(app);

};