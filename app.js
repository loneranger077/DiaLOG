const express = require("express")
require('dotenv').config()
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.js')[env];

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'pug')
app.set('views', './views')

// Routes
app.use(express.static("./public"));
require("./routes")(app);

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});