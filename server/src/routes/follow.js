const express = require('express');
const { Follow, User } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 关注用户
router.post('/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (userId === req.user.id) {
      return res.status(400).json({
        code: 400,
        msg: '不能关注自己'
      });
    }
    
    // 检查目标用户是否存在
    const targetUser = await User.findByPk(userId);
    if (!targetUser) {
      return res.status(404).json({
        code: 404,
        msg: '用户不存在'
      });
    }
    
    // 检查是否已关注
    const existingFollow = await Follow.findOne({
      where: {
        follower_id: req.user.id,
        following_id: userId
      }
    });
    
    if (existingFollow) {
      if (existingFollow.status === 0) {
        return res.status(400).json({
          code: 400,
          msg: '已经关注过了'
        });
      } else {
        await existingFollow.update({ status: 0 });
      }
    } else {
      await Follow.create({
        follower_id: req.user.id,
        following_id: userId
      });
    }
    
    // 更新统计数据
    await req.user.increment('following_count');
    await targetUser.increment('followers_count');
    
    res.json({
      code: 0,
      msg: '关注成功'
    });
  } catch (error) {
    console.error('关注错误:', error);
    res.status(500).json({
      code: 500,
      msg: '关注失败'
    });
  }
});

// 取消关注
router.delete('/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const follow = await Follow.findOne({
      where: {
        follower_id: req.user.id,
        following_id: userId,
        status: 0
      }
    });
    
    if (!follow) {
      return res.status(400).json({
        code: 400,
        msg: '还未关注该用户'
      });
    }
    
    await follow.update({ status: 1 });
    
    // 更新统计数据
    await req.user.decrement('following_count');
    const targetUser = await User.findByPk(userId);
    if (targetUser) {
      await targetUser.decrement('followers_count');
    }
    
    res.json({
      code: 0,
      msg: '取消关注成功'
    });
  } catch (error) {
    console.error('取消关注错误:', error);
    res.status(500).json({
      code: 500,
      msg: '取消关注失败'
    });
  }
});

module.exports = router;