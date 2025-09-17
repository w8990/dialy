const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Follow = sequelize.define('Follow', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  follower_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  following_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-正常 1-取消'
  }
}, {
  tableName: 'follows',
  indexes: [
    { fields: ['follower_id'] },
    { fields: ['following_id'] },
    { fields: ['status'] },
    { fields: ['follower_id', 'following_id'], unique: true },
    { fields: ['follower_id', 'status'] },
    { fields: ['following_id', 'status'] }
  ]
});

module.exports = Follow;