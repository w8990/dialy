const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User } = require('../models');
const { generateToken } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

const router = express.Router();

// 用户注册
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { username, phone, email, password, nickname } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          username ? { username } : null,
          phone ? { phone } : null,
          email ? { email } : null
        ].filter(Boolean)
      }
    });

    if (existingUser) {
      return res.status(400).json({
        code: 400,
        msg: '用户已存在'
      });
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 12);

    // 创建用户
    const user = await User.create({
      username,
      phone,
      email,
      password_hash: passwordHash,
      nickname: nickname || username || phone,
      register_ip: req.ip
    });

    // 生成令牌
    const token = generateToken({ userId: user.id });

    res.status(201).json({
      code: 0,
      msg: '注册成功',
      data: {
        token,
        userInfo: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
          bio: user.bio
        }
      }
    });

  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      code: 500,
      msg: '注册失败'
    });
  }
});

// 用户登录
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;

    // 查找用户
    const user = await User.findOne({
      where: {
        [Op.or]: [
          username ? { username } : null,
          phone ? { phone } : null,
          email ? { email } : null
        ].filter(Boolean)
      }
    });

    if (!user) {
      return res.status(400).json({
        code: 400,
        msg: '用户不存在'
      });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({
        code: 400,
        msg: '密码错误'
      });
    }

    // 检查账户状态
    if (user.status !== 0) {
      return res.status(403).json({
        code: 403,
        msg: '账户已被禁用'
      });
    }

    // 更新最后登录时间
    await user.update({ last_login_at: new Date() });

    // 生成令牌
    const token = generateToken({ userId: user.id });

    res.json({
      code: 0,
      msg: '登录成功',
      data: {
        token,
        userInfo: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
          bio: user.bio,
          gender: user.gender,
          followers_count: user.followers_count,
          following_count: user.following_count,
          posts_count: user.posts_count
        }
      }
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      code: 500,
      msg: '登录失败'
    });
  }
});

// 发送短信验证码（模拟）
router.post('/send-sms', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        code: 400,
        msg: '手机号不能为空'
      });
    }

    // 这里应该调用短信服务发送验证码
    // 为了演示，我们模拟一个成功响应
    console.log(`发送验证码到手机号: ${phone}`);

    res.json({
      code: 0,
      msg: '验证码发送成功'
    });

  } catch (error) {
    console.error('发送短信错误:', error);
    res.status(500).json({
      code: 500,
      msg: '发送失败'
    });
  }
});

// 短信验证码登录（模拟）
router.post('/login-sms', async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({
        code: 400,
        msg: '手机号和验证码不能为空'
      });
    }

    // 这里应该验证短信验证码
    // 为了演示，我们假设验证码是 '123456'
    if (code !== '123456') {
      return res.status(400).json({
        code: 400,
        msg: '验证码错误'
      });
    }

    // 查找或创建用户
    let user = await User.findOne({ where: { phone } });
    
    if (!user) {
      // 创建新用户
      user = await User.create({
        phone,
        nickname: `用户${phone.slice(-4)}`,
        register_ip: req.ip
      });
    }

    // 检查账户状态
    if (user.status !== 0) {
      return res.status(403).json({
        code: 403,
        msg: '账户已被禁用'
      });
    }

    // 更新最后登录时间
    await user.update({ last_login_at: new Date() });

    // 生成令牌
    const token = generateToken({ userId: user.id });

    res.json({
      code: 0,
      msg: '登录成功',
      data: {
        token,
        userInfo: {
          id: user.id,
          phone: user.phone,
          nickname: user.nickname,
          avatar: user.avatar,
          bio: user.bio
        }
      }
    });

  } catch (error) {
    console.error('短信登录错误:', error);
    res.status(500).json({
      code: 500,
      msg: '登录失败'
    });
  }
});

module.exports = router;