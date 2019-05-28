'use strict';
module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    user: DataTypes.INTEGER,
    group: DataTypes.INTEGER
  }, {});
  Member.associate = function(models) {
    // associations can be defined here
  };
  return Member;
};