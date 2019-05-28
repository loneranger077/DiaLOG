'use strict';
module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    user: {
      allowNull: false,
      unique: 'uniqueMember',
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' }
    },
    group: {
      allowNull: false,
      unique: 'uniqueMember',
      type: Sequelize.INTEGER,
      references: { model: 'Groups', key: 'id' }
    }
  }, {});
  Member.associate = function(models) {
    // associations can be defined here
    this.belongsTo(models.User, {
      foreignKey: 'user',
      constraints: true
    });
    this.belongsTo(models.Group, {
      foreignKey: 'group',
      constraints: true
    });
  };
  return Member;
};