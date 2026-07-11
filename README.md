# 指尖上的中国 — 非遗体验课在线预约平台

连接非遗传承人与爱好者的 O2O 体验课预约平台。在线浏览非遗项目、预约体验课程、上传作品展示、参与非遗投票。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vue 3 (Composition API) + Vite |
| 后端 | Supabase (PostgreSQL + REST API) |
| 部署 | GitHub Pages |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打包构建
npm run build
```

## 项目结构

```
ich-app/
├── index.html                  # HTML 入口
├── vite.config.js              # Vite 配置
├── package.json                # 依赖与脚本
├── supabase_schema.sql         # 数据库建表 SQL
├── 需求文档.md                  # 需求文档
├── API接口文档.md              # API 接口文档
├── 技术设计文档.md              # 技术设计文档
└── src/
    ├── main.js                 # 应用入口
    ├── App.vue                 # 根组件（页面切换）
    ├── api.js                  # 数据层（Supabase 封装）
    ├── data.js                 # 静态数据（非遗分类等）
    ├── style.css               # 全局样式
    └── components/
        ├── AppHeader.vue       # 顶部导航
        ├── HeroBanner.vue      # 首页标语
        ├── CategoryCard.vue    # 分类卡片
        ├── DetailPage.vue      # 分类详情
        ├── BookingPage.vue     # 预约页
        ├── BookingForm.vue     # 预约表单
        ├── BookingPreview.vue  # 预约预览
        ├── BookingRecord.vue   # 预约记录
        ├── MyPage.vue          # 个人中心
        ├── AuthPage.vue        # 登录注册
        ├── ChinaMap.vue        # 非遗地图
        ├── UploadBar.vue       # 作品上传
        ├── WorkCard.vue        # 作品卡片
        ├── ConfirmModal.vue    # 确认弹窗
        ├── VideoModal.vue      # 视频弹窗
        ├── ParticleBg.vue      # 粒子背景
        ├── AdminPage.vue       # 管理后台布局
        └── admin/
            ├── AdminDashboard.vue     # 数据概览
            ├── UserManager.vue        # 用户管理
            ├── BookingManager.vue     # 预约管理
            ├── WorkReview.vue         # 作品审核
            ├── ContentManager.vue     # 内容管理
            └── NotificationCenter.vue # 消息通知
```

## 功能模块

- **非遗浏览** — 9 类非遗卡片展示，文章阅读，视频观看
- **预约体验** — 选择项目/时间/人数，提交预约
- **作品展示** — 拖拽上传图片（自动压缩），网格展示
- **非遗地图** — 省份红点标注，投票排行
- **管理后台** — 数据概览、用户管理、预约管理、作品审核、内容管理、消息通知
- **消息通知** — 管理员发送通知，用户查看已读/未读

## 部署

```bash
npm run build
git subtree push --prefix dist origin gh-pages
```

GitHub Pages 将 `gh-pages` 分支设为发布源即可。
