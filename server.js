const express = require("express")
const session = require('express-session');
const enableWs = require('express-ws')
const Sockets = require("./sockets/socketRoutes");
const path = require("path")
const MySQLStore = require('connect-mysql')(session)

require('dotenv').config()

const app = express();
const wss = enableWs(app)

global.rootPath = path.resolve(__dirname);
const PORT = process.env.PORT || 3000;

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        expires: 1000 * 60 * 60 * 24 * 3
    },
    store: new MySQLStore({
        config: {
            user: process.env.DBUser,
            password: process.env.DBPassword,
            database: process.env.DB
        }
    })
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'pug')
app.set('views', './views')

// Routes
app.use(express.static("./public"));

require("./routes/routes")(app, new Sockets(app));

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});