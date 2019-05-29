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
    active: req => {
        return req.session.userID
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
    },
    getGroups: function (req) {
        const sessionUser = this.getUser(req)
        return new Promise(function (resolve, reject) {
            sessionUser.then(user => {
                user.getMembers().then(members => {
                    db.Group.findAll({
                        where: {
                            id: members.map(member => {
                                return member.group
                            })
                        }
                    }).then(groups => {
                        resolve( groups )
                    }).catch(error => {
                        throw error
                    })
                }).catch(error => {
                    throw error
                })
            }).catch(error => {
                throw error
            })
        });
    }
};