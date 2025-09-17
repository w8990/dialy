const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define('Post', {
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
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  media: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '媒体文件列表'
  },
  topics: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '话题标签'
  },
  location_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  location_address: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  location_latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  location_longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  visibility: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '1-公开 2-好友可见 3-仅自己可见'
  },
  like_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  comment_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  share_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-正常 1-删除 2-审核中 3-违规'
  }
}, {
  tableName: 'posts',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['status'] },
    { fields: ['visibility'] },
    { fields: ['created_at'] },
    { fields: ['like_count'] },
    { fields: ['user_id', 'status'] },
    { fields: ['status', 'visibility', 'created_at'] }
  ]
});

module.exports = Post;