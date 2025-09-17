const { sequelize } = require('../config/database');
const models = require('../models');

const initDatabase = async () => {
  try {
    console.log('🔄 开始初始化数据库...');

    // 测试数据库连接
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');

    // 同步所有模型到数据库
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ 数据库表结构同步完成');

    // 创建基础话题数据
    const { Topic } = models;
    const defaultTopics = [
      { name: '摄影', description: '分享美好瞬间，记录生活点滴' },
      { name: '美食', description: '发现美味，分享快乐' },
      { name: '旅行', description: '世界那么大，一起去看看' },
      { name: '生活', description: '记录日常，分享心情' },
      { name: '运动', description: '健康生活，活力满满' },
      { name: '音乐', description: '音乐无国界，分享美妙旋律' },
      { name: '科技', description: '探索科技前沿，分享新知' },
      { name: '读书', description: '书籍是人类进步的阶梯' }
    ];

    for (const topicData of defaultTopics) {
      await Topic.findOrCreate({
        where: { name: topicData.name },
        defaults: topicData
      });
    }
    console.log('✅ 默认话题数据创建完成');

    console.log('🎉 数据库初始化完成！');
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    throw error;
  }
};

// 如果直接运行此脚本
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('数据库初始化成功');
      process.exit(0);
    })
    .catch((error) => {
      console.error('数据库初始化失败:', error);
      process.exit(1);
    });
}

module.exports = initDatabase;