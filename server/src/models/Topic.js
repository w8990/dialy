const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Topic = sequelize.define('Topic', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  posts_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  followers_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-正常 1-禁用'
  }
}, {
  tableName: 'topics',
  indexes: [
    { fields: ['name'] },
    { fields: ['status'] },
    { fields: ['posts_count'] },
    { fields: ['status', 'posts_count'] }
  ]
});

module.exports = Topic;