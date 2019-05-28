'use strict';
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    user: DataTypes.INTEGER,
    group: DataTypes.INTEGER,
    channel: DataTypes.INTEGER,
    body: DataTypes.STRING,
    title: DataTypes.STRING
  }, {});
  message.associate = function(models) {
    // associations can be defined here
  };
  return message;
};