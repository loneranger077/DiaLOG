'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
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
  return User;
};