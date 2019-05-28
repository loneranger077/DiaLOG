'use strict';
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    name: {
      allowNull: false,
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    group: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: { model: 'Groups', key: 'id' }
    }
  }, {});
  Channel.associate = function(models) {
    // associations can be defined here
    this.hasMany(models.Message, {
      foreignKey: 'channel',
      constraints: true
    });

    this.belongsTo(models.Group, {
      foreignKey: 'group',
      constraints: true
    });
  };
  return Channel;
};