const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  nickname: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  bio: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  gender: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-未知 1-男 2-女'
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  location_province: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  location_city: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  location_district: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-正常 1-禁用'
  },
  followers_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  following_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  posts_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  register_ip: {
    type: DataTypes.STRING(45),
    allowNull: true
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['username'] },
    { fields: ['phone'] },
    { fields: ['email'] },
    { fields: ['nickname'] },
    { fields: ['status'] }
  ]
});

module.exports = User;