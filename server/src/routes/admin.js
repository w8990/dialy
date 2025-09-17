const express = require('express');
const { User, Post, Comment, Follow, Like, Topic, Message } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// 简单的管理员认证（生产环境请使用更安全的方式）
const adminAuth = (req, res, next) => {
  const { password } = req.query;
  if (password !== 'admin123') {
    return res.status(401).json({ error: '需要管理员权限' });
  }
  next();
};

// 数据库概览
router.get('/overview', adminAuth, async (req, res) => {
  try {
    const stats = await Promise.all([
      User.count(),
      Post.count(),
      Comment.count(),
      Follow.count({ where: { status: 0 } }),
      Like.count({ where: { status: 0 } }),
      Topic.count(),
      Message.count()
    ]);

    res.json({
      users: stats[0],
      posts: stats[1],
      comments: stats[2],
      follows: stats[3],
      likes: stats[4],
      topics: stats[5],
      messages: stats[6]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取用户列表
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const users = await User.findAndCountAll({
      attributes: { exclude: ['password_hash'] },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['created_at', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取动态列表
router.get('/posts', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const posts = await Post.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['created_at', 'DESC']]
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取评论列表
router.get('/comments', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const comments = await Comment.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar']
        },
        {
          model: Post,
          as: 'post',
          attributes: ['id', 'content']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['created_at', 'DESC']]
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取话题列表
router.get('/topics', adminAuth, async (req, res) => {
  try {
    const topics = await Topic.findAll({
      order: [['posts_count', 'DESC']]
    });

    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 搜索用户
router.get('/search/users', adminAuth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { nickname: { [Op.like]: `%${q}%` } },
          { username: { [Op.like]: `%${q}%` } },
          { phone: { [Op.like]: `%${q}%` } }
        ]
      },
      attributes: { exclude: ['password_hash'] },
      limit: 10
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 用户详情
router.get('/users/:userId', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 获取用户的最近动态
    const recentPosts = await Post.findAll({
      where: { user_id: userId },
      limit: 5,
      order: [['created_at', 'DESC']]
    });

    res.json({
      user,
      recentPosts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 执行原始SQL查询（谨慎使用）
router.post('/query', adminAuth, async (req, res) => {
  try {
    const { sql } = req.body;
    
    if (!sql) {
      return res.status(400).json({ error: 'SQL查询不能为空' });
    }

    // 只允许SELECT查询
    if (!sql.trim().toLowerCase().startsWith('select')) {
      return res.status(400).json({ error: '只允许SELECT查询' });
    }

    const { sequelize } = require('../config/database');
    const results = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;