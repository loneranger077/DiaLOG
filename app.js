const express = require("express")
require('dotenv').config()
const session = require('express-session');
const MySQLStore = require('connect-mysql')(session)

const app = express();
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
require("./routes")(app);

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});