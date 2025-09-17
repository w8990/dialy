const express = require('express');
const { User } = require('../models');
const { authenticate } = require('../middleware/auth');
const { validateUpdateUser } = require('../middleware/validation');

const router = express.Router();

// 获取当前用户信息
router.get('/profile', authenticate, async (req, res) => {
  try {
    res.json({
      code: 0,
      msg: '获取成功',
      data: req.user
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      code: 500,
      msg: '获取用户信息失败'
    });
  }
});

// 更新用户信息
router.put('/profile', authenticate, validateUpdateUser, async (req, res) => {
  try {
    const updateData = req.body;
    
    await req.user.update(updateData);
    
    res.json({
      code: 0,
      msg: '更新成功',
      data: req.user
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({
      code: 500,
      msg: '更新用户信息失败'
    });
  }
});

// 获取指定用户信息
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash', 'register_ip'] }
    });
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        msg: '用户不存在'
      });
    }
    
    res.json({
      code: 0,
      msg: '获取成功',
      data: user
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      code: 500,
      msg: '获取用户信息失败'
    });
  }
});

module.exports = router;