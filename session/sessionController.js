const db = require("../models")
const bcrypt = require("bcrypt");

module.exports = {
    // compare the password the the password for a given username
    activate: (req, username, password) => {
        return new Promise(function (resolve, reject) {
            db.User.findOne({
                where: {
                    username: username
                }
            }).then((user) => {
                if (bcrypt.compareSync(password, user.password)) {
                    req.session.userID = user.id
                    resolve(user)
                } else {
                    reject("Invalid username or password")
                }
            })
        });
    },
    // gets the user from the session
    user: req => {
        return new Promise(function (resolve, reject) {
            if (!req.session.userID) return reject(false)
            console.log(req.session.userID);
            db.User.findOne({
                where: {
                    id: req.session.userID
                }
            }).then((user) => {
                resolve(user)
            })
        });
    },
    // destroys the current session
    destroy: req => {
        return new Promise(function (resolve, reject) {
            req.session.destroy()
            resolve(true)
        });
    }
};