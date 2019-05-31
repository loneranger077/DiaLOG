const path = require("path");

module.exports = function (app) {

    require("./user.js")(app);
    require("./group.js")(app);
    require("./channel.js")(app);
    require("./message.js")(app);
    require("./member.js")(app);
};