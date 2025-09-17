const Joi = require('joi');

// 创建验证中间件
const createValidationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        msg: '参数验证失败',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// 注册验证
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(128).required(),
  nickname: Joi.string().min(1).max(50)
}).or('username', 'phone', 'email');

// 登录验证
const loginSchema = Joi.object({
  username: Joi.string(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/),
  email: Joi.string().email(),
  password: Joi.string().required()
}).or('username', 'phone', 'email');

// 动态发布验证
const createPostSchema = Joi.object({
  content: Joi.string().max(2000).allow(''),
  media: Joi.array().items(Joi.object({
    type: Joi.string().valid('image', 'video', 'audio').required(),
    url: Joi.string().required(),
    size: Joi.number(),
    width: Joi.number(),
    height: Joi.number(),
    duration: Joi.number()
  })).max(9),
  topics: Joi.array().items(Joi.string().max(20)).max(5),
  location: Joi.object({
    name: Joi.string().max(100),
    address: Joi.string().max(200),
    latitude: Joi.number(),
    longitude: Joi.number()
  }),
  visibility: Joi.number().valid(1, 2, 3).default(1)
}).custom((value, helpers) => {
  if (!value.content && (!value.media || value.media.length === 0)) {
    return helpers.error('custom.contentRequired');
  }
  return value;
}, 'Content or media required').messages({
  'custom.contentRequired': '内容或媒体文件不能为空'
});

// 评论验证
const createCommentSchema = Joi.object({
  post_id: Joi.string().uuid().required(),
  content: Joi.string().min(1).max(500).required(),
  parent_id: Joi.string().uuid(),
  reply_to_user_id: Joi.string().uuid()
});

// 用户信息更新验证
const updateUserSchema = Joi.object({
  nickname: Joi.string().min(1).max(50),
  avatar: Joi.string().max(500),
  bio: Joi.string().max(500),
  gender: Joi.number().valid(0, 1, 2),
  birthday: Joi.date(),
  location_province: Joi.string().max(50),
  location_city: Joi.string().max(50),
  location_district: Joi.string().max(50)
});

module.exports = {
  validateRegister: createValidationMiddleware(registerSchema),
  validateLogin: createValidationMiddleware(loginSchema),
  validateCreatePost: createValidationMiddleware(createPostSchema),
  validateCreateComment: createValidationMiddleware(createCommentSchema),
  validateUpdateUser: createValidationMiddleware(updateUserSchema)
};