'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    user: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'id' }
    }
  }, {
      getterMethods: {
        channelsAPIPath() {
          return `/api/channels/${this.id}`
        }
      }
    });
  Group.associate = function (models) {
    // associations can be defined here
    this.hasMany(models.Member, {
      foreignKey: 'group',
      constraints: true
    });
    this.hasMany(models.Channel, {
      foreignKey: 'group',
      constraints: true
    });
    this.hasMany(models.Message, {
      foreignKey: 'group',
      constraints: true
    });

    this.belongsTo(models.User, {
      foreignKey: 'user',
      constraints: true
    });
  };
  return Group;
};