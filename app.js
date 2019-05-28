const express = require("express")
const env = process.env.NODE_ENV || 'development';
const config = require('/config/config.json')[env];

var app = express();
var PORT = process.env.PORT || config.serverPort;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use(express.static("./public"));
require("./routes")(app);

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});