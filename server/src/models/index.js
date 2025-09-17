const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Follow = require('./Follow');
const Like = require('./Like');
const Message = require('./Message');
const Topic = require('./Topic');

// 定义关联关系

// 用户和动态
User.hasMany(Post, { foreignKey: 'user_id', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// 用户和评论
User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// 动态和评论
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

// 评论的回复关系
Comment.hasMany(Comment, { foreignKey: 'parent_id', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parent_id', as: 'parent' });

// 评论回复的用户关系
Comment.belongsTo(User, { foreignKey: 'reply_to_user_id', as: 'replyToUser' });

// 关注关系
User.hasMany(Follow, { foreignKey: 'follower_id', as: 'following' });
User.hasMany(Follow, { foreignKey: 'following_id', as: 'followers' });
Follow.belongsTo(User, { foreignKey: 'follower_id', as: 'follower' });
Follow.belongsTo(User, { foreignKey: 'following_id', as: 'following' });

// 点赞关系
User.hasMany(Like, { foreignKey: 'user_id', as: 'likes' });
Like.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// 消息关系
User.hasMany(Message, { foreignKey: 'from_user_id', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'to_user_id', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'from_user_id', as: 'fromUser' });
Message.belongsTo(User, { foreignKey: 'to_user_id', as: 'toUser' });

module.exports = {
  User,
  Post,
  Comment,
  Follow,
  Like,
  Message,
  Topic
};