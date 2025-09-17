const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  target_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  target_type: {
    type: DataTypes.ENUM('post', 'comment'),
    allowNull: false
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-正常 1-取消'
  }
}, {
  tableName: 'likes',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['target_id'] },
    { fields: ['target_type'] },
    { fields: ['status'] },
    { fields: ['user_id', 'target_id', 'target_type'], unique: true },
    { fields: ['target_id', 'target_type', 'status'] }
  ]
});

module.exports = Like;