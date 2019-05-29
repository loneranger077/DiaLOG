'use strict';
const bcrypt = require("bcrypt")
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      set(val) {
        const hash = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hash);
      }
    },
    active: {
      allowNull: false,
      default: false,
      type: DataTypes.BOOLEAN
    },
    admin: {
      allowNull: false,
      default: false,
      type: DataTypes.BOOLEAN
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    this.hasMany(models.Group, {
      foreignKey: 'user',
      constraints: true
    });
    this.hasMany(models.Member, {
      foreignKey: 'user',
      constraints: true
    });
    this.hasMany(models.Message, {
      foreignKey: 'user',
      constraints: true
    });
  };
  User.login = function (passwordInput) {
    return (bcrypt.compareSync(passwordInput, this.password)) ? true : false;
  }
  return User;
};