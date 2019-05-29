const db = require("../models")
const bcrypt = require("bcrypt");

module.exports = {
    verify: (req, username, password) => {
        return new Promise(function (resolve, reject) {
            db.User.findOne({
                where: {
                    username: username
                }
            }).then((user) => {
                if (bcrypt.compareSync(password, user.password)) {
                    req.session.userID = user.id
                    resolve(user.id)
                } else {
                    reject("Invalid username or password")
                }
            }).catch(error => {
                throw error
            })
        });
    },
    getUser: (req) => {
        return new Promise(function (resolve, reject) {
            db.User.findOne({
                where: {
                    id: req.session.userID
                }
            }).then((user) => {
                resolve(user)
            }).catch(error => {
                throw error
            })
        });
    }
};