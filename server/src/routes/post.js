const express = require('express');
const { Post, User, Like } = require('../models');
const { authenticate } = require('../middleware/auth');
const { validateCreatePost } = require('../middleware/validation');
const { Op } = require('sequelize');

const router = express.Router();

// 发布动态
router.post('/', authenticate, validateCreatePost, async (req, res) => {
  try {
    const postData = {
      ...req.body,
      user_id: req.user.id
    };
    
    const post = await Post.create(postData);
    
    // 更新用户动态数量
    await req.user.increment('posts_count');
    
    res.status(201).json({
      code: 0,
      msg: '发布成功',
      data: { id: post.id }
    });
  } catch (error) {
    console.error('发布动态错误:', error);
    res.status(500).json({
      code: 500,
      msg: '发布失败'
    });
  }
});

// 获取动态列表
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, pageSize = 10, type = 'recommend' } = req.query;
    const limit = Math.min(parseInt(pageSize), 50);
    const offset = (parseInt(page) - 1) * limit;
    
    const posts = await Post.findAndCountAll({
      where: {
        status: 0,
        [Op.or]: [
          { visibility: 1 }, // 公开
          { user_id: req.user.id } // 自己的动态
        ]
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
    
    // 检查当前用户是否点赞了这些动态
    if (posts.rows.length > 0) {
      const postIds = posts.rows.map(post => post.id);
      const likes = await Like.findAll({
        where: {
          user_id: req.user.id,
          target_id: { [Op.in]: postIds },
          target_type: 'post',
          status: 0
        }
      });
      
      const likedPostIds = new Set(likes.map(like => like.target_id));
      
      posts.rows.forEach(post => {
        post.dataValues.isLiked = likedPostIds.has(post.id);
        post.dataValues.createdAt = formatTime(post.created_at);
      });
    }
    
    res.json({
      code: 0,
      msg: '获取成功',
      data: posts.rows,
      pagination: {
        total: posts.count,
        page: parseInt(page),
        pageSize: limit,
        totalPages: Math.ceil(posts.count / limit)
      }
    });
  } catch (error) {
    console.error('获取动态列表错误:', error);
    res.status(500).json({
      code: 500,
      msg: '获取动态列表失败'
    });
  }
});

// 点赞动态
router.post('/:postId/like', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    
    // 检查动态是否存在
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        code: 404,
        msg: '动态不存在'
      });
    }
    
    // 检查是否已点赞
    const existingLike = await Like.findOne({
      where: {
        user_id: req.user.id,
        target_id: postId,
        target_type: 'post'
      }
    });
    
    if (existingLike) {
      if (existingLike.status === 0) {
        return res.status(400).json({
          code: 400,
          msg: '已经点赞过了'
        });
      } else {
        // 重新点赞
        await existingLike.update({ status: 0 });
      }
    } else {
      // 新增点赞
      await Like.create({
        user_id: req.user.id,
        target_id: postId,
        target_type: 'post'
      });
    }
    
    // 更新动态点赞数
    await post.increment('like_count');
    
    res.json({
      code: 0,
      msg: '点赞成功'
    });
  } catch (error) {
    console.error('点赞错误:', error);
    res.status(500).json({
      code: 500,
      msg: '点赞失败'
    });
  }
});

// 取消点赞
router.delete('/:postId/like', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    
    const like = await Like.findOne({
      where: {
        user_id: req.user.id,
        target_id: postId,
        target_type: 'post',
        status: 0
      }
    });
    
    if (!like) {
      return res.status(400).json({
        code: 400,
        msg: '还未点赞'
      });
    }
    
    await like.update({ status: 1 });
    
    // 更新动态点赞数
    const post = await Post.findByPk(postId);
    if (post) {
      await post.decrement('like_count');
    }
    
    res.json({
      code: 0,
      msg: '取消点赞成功'
    });
  } catch (error) {
    console.error('取消点赞错误:', error);
    res.status(500).json({
      code: 500,
      msg: '取消点赞失败'
    });
  }
});

// 时间格式化函数
function formatTime(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now - date;
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return Math.floor(diff / minute) + '分钟前';
  } else if (diff < day) {
    return Math.floor(diff / hour) + '小时前';
  } else if (diff < 7 * day) {
    return Math.floor(diff / day) + '天前';
  } else {
    return `${date.getMonth() + 1}-${date.getDate()}`;
  }
}

module.exports = router;