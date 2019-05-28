'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    user: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' }
    },
    group: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: { model: 'Groups', key: 'id' }
    },
    channel: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: { model: 'Channels', key: 'id' }
    },
    body: {
      allowNull: false,
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    }
  }, {});
  Message.associate = function(models) {
    // associations can be defined here
    this.belongsTo(models.User, {
      foreignKey: 'user',
      constraints: true
    });
    this.belongsTo(models.Group, {
      foreignKey: 'group',
      constraints: true
    });
    this.belongsTo(models.Channel, {
      foreignKey: 'channel',
      constraints: true
    });
  };
  return Message;
};