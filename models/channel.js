'use strict';
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    group: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Groups', key: 'id' }
    }
  }, {
      getterMethods: {
        messagesAPIPath() {
          return `/api/messages/${this.id}`
        },
        mapData (){
          return { id: this.id, name: this.name, messagesAPIPath: this.messagesAPIPath }
        }
      }
  });
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