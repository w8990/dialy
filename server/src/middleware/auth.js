const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 生成JWT令牌
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// 验证JWT令牌
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// 认证中间件
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        code: 401,
        msg: '缺少认证令牌'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        code: 401,
        msg: '认证令牌格式错误'
      });
    }

    // 验证令牌
    const decoded = verifyToken(token);
    
    // 查找用户
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!user) {
      return res.status(401).json({
        code: 401,
        msg: '用户不存在'
      });
    }

    if (user.status !== 0) {
      return res.status(403).json({
        code: 403,
        msg: '账户已被禁用'
      });
    }

    // 将用户信息附加到请求对象
    req.user = user;
    next();
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 401,
        msg: '认证令牌已过期'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        code: 401,
        msg: '认证令牌无效'
      });
    }
    
    console.error('认证中间件错误:', error);
    return res.status(500).json({
      code: 500,
      msg: '认证失败'
    });
  }
};

// 可选认证中间件（允许匿名访问）
const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password_hash'] }
    });
    
    req.user = user && user.status === 0 ? user : null;
    next();
    
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  optionalAuthenticate
};