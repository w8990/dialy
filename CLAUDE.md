# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 uni-app x 项目，名为 "dialy"，使用 Vue 3 框架开发。项目支持多端部署，包括小程序（微信、支付宝、百度、头条）、App（Android、iOS）和快应用。

## 技术架构

- **框架**: uni-app x + Vue 3
- **语言**: TypeScript (UTS)
- **文件类型**: .uvue (Vue单文件组件), .uts (TypeScript)
- **云服务**: uniCloud (阿里云)
- **样式**: uni.scss + 原生CSS

## 核心目录结构

```
/
├── App.uvue              # 应用主入口文件
├── main.uts              # 应用启动文件
├── manifest.json         # 应用配置文件
├── pages.json            # 页面路由配置
├── pages/                # 页面目录
│   └── index/            # 首页
├── static/               # 静态资源
├── uniCloud-aliyun/      # 阿里云uniCloud配置
│   ├── cloudfunctions/   # 云函数
│   └── database/         # 数据库配置
└── uni_modules/          # uni插件模块
    ├── uni-config-center/ # 配置管理插件
    └── uni-id-common/    # 用户身份管理插件
```

## 开发重要信息

### 文件扩展名
- 页面和组件使用 `.uvue` 扩展名
- 脚本文件使用 `.uts` 扩展名（TypeScript的uni-app变体）
- 配置文件为 `.json` 格式

### 条件编译
项目使用条件编译支持多端：
- `#ifdef APP-ANDROID || APP-HARMONY` - Android/鸿蒙App特定代码
- `#endif` - 条件编译结束标记

### uniCloud集成
- 使用 `uni-config-center` 进行统一配置管理
- 云函数位于 `uniCloud-aliyun/cloudfunctions/`
- 数据库查询文件位于 `database/JQL查询.jql`

### 样式规范
- 全局样式定义在 `App.uvue` 的 `<style>` 部分
- 使用 `.uni-row` 和 `.uni-column` 进行布局控制

## 注意事项

- 这是一个新创建的项目，大部分配置为默认值
- manifest.json 中的 appid 等配置需要在实际部署时填写
- 项目使用 Vue 3 的组合式API和选项式API混合开发模式