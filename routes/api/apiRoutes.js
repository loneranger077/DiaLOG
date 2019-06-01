module.exports = function (app, sockets) {

    require("./models/user")(app);
    require("./models/group")(app, sockets);
    require("./models/member")(app, sockets);
    require("./models/channel")(app, sockets);
    require("./models/message")(app, sockets);
};