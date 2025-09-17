# 交友社区后端服务

基于 Node.js + Express + MySQL 的社交应用后端API服务。

## 环境要求

- Node.js 16.0+
- MySQL 8.0+
- npm 或 yarn

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 数据库配置

#### 创建MySQL数据库

```sql
-- 登录MySQL
mysql -u root -p

-- 创建数据库
CREATE DATABASE dialy_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户（可选）
CREATE USER 'dialy_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON dialy_dev.* TO 'dialy_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 配置数据库连接

编辑 `src/config/database.js` 文件，修改数据库连接信息：

```javascript
const config = {
  development: {
    database: 'dialy_dev',
    username: 'root',        // 你的数据库用户名
    password: 'password',    // 你的数据库密码
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
  }
}
```

### 3. 初始化数据库

```bash
# 运行数据库初始化脚本
npm run init-db
```

### 4. 启动服务

```bash
# 开发模式（支持热重载）
npm run dev

# 生产模式
npm start
```

服务启动后，API地址为：`http://localhost:3000/api`

## 项目结构

```
server/
├── src/
│   ├── config/          # 配置文件
│   │   └── database.js  # 数据库配置
│   ├── models/          # 数据模型
│   │   ├── User.js      # 用户模型
│   │   ├── Post.js      # 动态模型
│   │   ├── Comment.js   # 评论模型
│   │   └── index.js     # 模型关联
│   ├── routes/          # API路由
│   │   ├── auth.js      # 认证相关
│   │   ├── user.js      # 用户相关
│   │   ├── post.js      # 动态相关
│   │   └── upload.js    # 文件上传
│   ├── middleware/      # 中间件
│   │   ├── auth.js      # 认证中间件
│   │   ├── validation.js # 参数验证
│   │   └── errorHandler.js # 错误处理
│   ├── scripts/         # 脚本文件
│   │   └── initDatabase.js # 数据库初始化
│   └── app.js          # 应用入口
├── uploads/            # 上传文件目录
├── package.json
└── README.md
```

## 主要API接口

### 认证相关 `/api/auth`

- `POST /register` - 用户注册
- `POST /login` - 用户登录
- `POST /login-sms` - 短信验证码登录
- `POST /send-sms` - 发送短信验证码

### 用户相关 `/api/user`

- `GET /profile` - 获取当前用户信息
- `PUT /profile` - 更新用户信息
- `GET /:userId` - 获取指定用户信息

### 动态相关 `/api/post`

- `POST /` - 发布动态
- `GET /` - 获取动态列表
- `GET /:postId` - 获取动态详情
- `DELETE /:postId` - 删除动态
- `POST /:postId/like` - 点赞动态
- `DELETE /:postId/like` - 取消点赞

### 评论相关 `/api/comment`

- `POST /` - 发布评论
- `GET /post/:postId` - 获取动态评论
- `DELETE /:commentId` - 删除评论

### 关注相关 `/api/follow`

- `POST /:userId` - 关注用户
- `DELETE /:userId` - 取消关注
- `GET /followers/:userId` - 获取粉丝列表
- `GET /following/:userId` - 获取关注列表

### 文件上传 `/api/upload`

- `POST /image` - 上传图片
- `POST /video` - 上传视频
- `POST /audio` - 上传音频

## 数据库表结构

### 用户表 (users)
- id: 用户ID (UUID)
- username: 用户名
- phone: 手机号
- email: 邮箱
- password_hash: 密码哈希
- nickname: 昵称
- avatar: 头像
- bio: 个人简介
- 统计字段和时间戳

### 动态表 (posts)
- id: 动态ID (UUID)
- user_id: 发布用户ID
- content: 动态内容
- media: 媒体文件(JSON)
- topics: 话题标签(JSON)
- 位置和可见性设置
- 统计字段和时间戳

### 其他表
- comments: 评论表
- follows: 关注关系表
- likes: 点赞记录表
- messages: 消息表
- topics: 话题表

## 环境变量

创建 `.env` 文件配置环境变量：

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-jwt-secret-key
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your-password
DB_DATABASE=dialy_dev
ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
```

## 部署建议

### 开发环境
1. 使用 `npm run dev` 启动开发服务器
2. 配置前端 uni-app 的 API_BASE_URL 为 `http://localhost:3000/api`

### 生产环境
1. 配置生产数据库
2. 设置环境变量
3. 使用 PM2 或 Docker 部署
4. 配置 Nginx 反向代理
5. 启用 HTTPS

```bash
# 使用PM2部署
npm install -g pm2
pm2 start src/app.js --name "dialy-api"
```

## 安全注意事项

1. 修改默认的 JWT_SECRET
2. 配置防火墙，只开放必要端口
3. 启用 HTTPS
4. 定期备份数据库
5. 监控服务器性能和日志

## 开发工具

- 推荐使用 Postman 或 Insomnia 测试API
- 使用 MySQL Workbench 管理数据库
- 配置代码编辑器的 ESLint 和 Prettier

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查MySQL服务是否启动
   - 验证数据库连接配置
   - 确认数据库用户权限

2. **端口被占用**
   - 修改 PORT 环境变量
   - 或者杀死占用端口的进程

3. **文件上传失败**
   - 检查 uploads 目录权限
   - 确认文件大小限制

### 日志查看
```bash
# PM2 日志
pm2 logs dialy-api

# 开发模式日志直接在控制台显示
```

## 联系方式

如有问题请提交 Issue 或联系开发团队。