// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize 验证错误
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => e.message);
    return res.status(400).json({
      code: 400,
      msg: '数据验证失败',
      errors: errors
    });
  }

  // Sequelize 唯一约束错误
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      code: 400,
      msg: '数据已存在'
    });
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      code: 401,
      msg: '认证令牌无效'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      code: 401,
      msg: '认证令牌已过期'
    });
  }

  // Multer 文件上传错误
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      code: 400,
      msg: '文件大小超出限制'
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      code: 400,
      msg: '文件数量超出限制'
    });
  }

  // 自定义错误
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      code: err.statusCode,
      msg: err.message
    });
  }

  // 默认服务器错误
  res.status(500).json({
    code: 500,
    msg: '服务器内部错误'
  });
};

// 404 处理
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    code: 404,
    msg: '接口不存在'
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};