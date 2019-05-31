const path = require("path");

module.exports = function (app, sockets) {

    require("./user.js")(app);
    require("./group.js")(app, sockets);
    require("./channel.js")(app, sockets);
    require("./message.js")(app, sockets);
    require("./member.js")(app, sockets);
};