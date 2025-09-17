const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名：时间戳_随机数_原文件名
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${uniqueSuffix}_${name}${ext}`);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 允许的文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB限制
  }
});

// 单文件上传
router.post('/single', authenticate, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        msg: '未选择文件'
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      code: 0,
      msg: '上传成功',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('文件上传错误:', error);
    res.status(500).json({
      code: 500,
      msg: '文件上传失败'
    });
  }
});

// 多文件上传
router.post('/multiple', authenticate, upload.array('files', 9), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        code: 400,
        msg: '未选择文件'
      });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`
    }));
    
    res.json({
      code: 0,
      msg: '上传成功',
      data: files
    });
  } catch (error) {
    console.error('多文件上传错误:', error);
    res.status(500).json({
      code: 500,
      msg: '文件上传失败'
    });
  }
});

// 删除文件
router.delete('/:filename', authenticate, (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        code: 0,
        msg: '删除成功'
      });
    } else {
      res.status(404).json({
        code: 404,
        msg: '文件不存在'
      });
    }
  } catch (error) {
    console.error('删除文件错误:', error);
    res.status(500).json({
      code: 500,
      msg: '删除文件失败'
    });
  }
});

module.exports = router;