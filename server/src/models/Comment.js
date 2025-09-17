const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  post_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'posts',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  parent_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'comments',
      key: 'id'
    }
  },
  reply_to_user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  like_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reply_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-正常 1-删除 2-审核中 3-违规'
  }
}, {
  tableName: 'comments',
  indexes: [
    { fields: ['post_id'] },
    { fields: ['user_id'] },
    { fields: ['parent_id'] },
    { fields: ['status'] },
    { fields: ['post_id', 'status'] },
    { fields: ['parent_id', 'created_at'] }
  ]
});

module.exports = Comment;