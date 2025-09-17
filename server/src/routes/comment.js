const express = require('express');
const { Comment, User, Post } = require('../models');
const { authenticate } = require('../middleware/auth');
const { validateCreateComment } = require('../middleware/validation');

const router = express.Router();

// 发布评论
router.post('/', authenticate, validateCreateComment, async (req, res) => {
  try {
    const commentData = {
      ...req.body,
      user_id: req.user.id
    };
    
    const comment = await Comment.create(commentData);
    
    // 更新动态评论数
    const post = await Post.findByPk(req.body.post_id);
    if (post) {
      await post.increment('comment_count');
    }
    
    res.status(201).json({
      code: 0,
      msg: '评论成功',
      data: { id: comment.id }
    });
  } catch (error) {
    console.error('评论错误:', error);
    res.status(500).json({
      code: 500,
      msg: '评论失败'
    });
  }
});

// 获取动态评论
router.get('/post/:postId', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, pageSize = 20 } = req.query;
    const limit = Math.min(parseInt(pageSize), 50);
    const offset = (parseInt(page) - 1) * limit;
    
    const comments = await Comment.findAndCountAll({
      where: {
        post_id: postId,
        status: 0,
        parent_id: null // 只获取主评论
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
    
    res.json({
      code: 0,
      msg: '获取成功',
      data: comments.rows
    });
  } catch (error) {
    console.error('获取评论错误:', error);
    res.status(500).json({
      code: 500,
      msg: '获取评论失败'
    });
  }
});

module.exports = router;