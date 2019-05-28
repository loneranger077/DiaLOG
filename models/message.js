'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    user: DataTypes.INTEGER,
    group: DataTypes.INTEGER,
    channel: DataTypes.INTEGER,
    body: DataTypes.STRING,
    title: DataTypes.STRING
  }, {});
  Message.associate = function(models) {
    // associations can be defined here
  };
  return Message;
};