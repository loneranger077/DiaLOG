'use strict';
module.exports = (sequelize, DataTypes) => {
  const member = sequelize.define('member', {
    user: DataTypes.INTEGER,
    group: DataTypes.INTEGER
  }, {});
  member.associate = function(models) {
    // associations can be defined here
  };
  return member;
};