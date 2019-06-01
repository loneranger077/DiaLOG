const db = require("../models")
const bcrypt = require("bcrypt");

module.exports = {
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
    destroy: req => {
        return new Promise(function (resolve, reject) {
            req.session.destroy()
            resolve(true)
        });
    }
};