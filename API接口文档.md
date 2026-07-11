# 指尖上的中国 — API接口文档

## 一、架构说明

本项目采用 **Supabase BaaS（Backend as a Service）** 架构，前端通过 `@supabase/supabase-js` 客户端库直接与 Supabase 的 PostgreSQL 数据库交互。Supabase 自动将数据库表暴露为 RESTful API，前端无需自建后端服务器。

```
浏览器(Vue 3) ——— HTTPS ——— Supabase REST API ——— PostgreSQL
```

**配置信息：**
- Supabase 项目：`vgvrjvmekxcsftnthxwf`
- 认证方式：anon key（公开可读密钥）
- 数据格式：请求/响应均为 JSON

## 二、数据库表结构

### 2.1 users 用户表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL PK | 自增主键 |
| username | TEXT UNIQUE | 用户名（唯一） |
| password | TEXT | 密码（本阶段明文存储） |
| avatar | TEXT | 头像 emoji，默认 🐱 |
| is_admin | BOOLEAN | 管理员标识，默认 false |
| created_at | TIMESTAMPTZ | 注册时间 |

### 2.2 bookings 预约表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT PK | 预约 ID（格式 BK+8位编码） |
| username | TEXT | 预约用户 |
| cat_id | TEXT | 非遗分类 ID |
| cat_name | TEXT | 非遗分类名称 |
| date | TEXT | 预约日期 |
| time | TEXT | 预约时间段 |
| people | INTEGER | 人数，默认 1 |
| name | TEXT | 联系人姓名 |
| phone | TEXT | 联系电话 |
| created_at | TIMESTAMPTZ | 创建时间 |

### 2.3 works 作品表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT PK | 作品 ID（格式 WK+8位编码） |
| username | TEXT | 上传用户 |
| cat_id | TEXT | 非遗分类 ID |
| image | TEXT | 图片 Base64 数据 |
| description | TEXT | 作品描述 |
| status | TEXT | 审核状态：pending/approved/rejected |
| created_at | TIMESTAMPTZ | 上传时间 |

### 2.4 interests 兴趣投票表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL PK | 自增主键 |
| ich_name | TEXT | 非遗项目名称 |
| username | TEXT | 投票用户 |
| created_at | TIMESTAMPTZ | 投票时间 |
| 唯一约束 | (ich_name, username) | 每人每项限投一票 |

### 2.5 ich_content 非遗内容表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL PK | 自增主键 |
| cat_id | TEXT | 关联非遗分类 |
| type | TEXT | 内容类型：article / video |
| title | TEXT | 标题 |
| content | TEXT | 内容（文章正文或视频链接） |
| description | TEXT | 简介描述 |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

### 2.6 notifications 通知表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL PK | 自增主键 |
| from_admin | TEXT | 发送者（管理员用户名） |
| to_user | TEXT | 接收者（null 表示全站广播） |
| title | TEXT | 通知标题 |
| message | TEXT | 通知内容 |
| is_read | BOOLEAN | 是否已读，默认 false |
| created_at | TIMESTAMPTZ | 发送时间 |

## 三、接口清单

### 3.1 认证

#### POST 注册

```
表：users  |  操作：INSERT
请求参数：{ username, password, avatar }
成功返回：{ username, avatar, is_admin }
错误：用户名已存在（23505）→ "用户名已存在"
```

#### POST 登录

```
表：users  |  操作：SELECT
查询条件：username = ? AND password = ?
成功返回：{ username, avatar, is_admin }
错误：无匹配记录 → "用户名或密码错误"
```

### 3.2 预约

#### 获取我的预约

```
表：bookings  |  操作：SELECT
查询条件：username = 当前用户
排序：created_at 降序
返回：预约记录数组
字段映射：cat_id→catId, cat_name→catName
```

#### 创建预约

```
表：bookings  |  操作：INSERT
请求参数：{ id, username, catId→cat_id, catName→cat_name, date, time, people, name, phone }
返回：{ id }
```

#### 删除预约

```
表：bookings  |  操作：DELETE
条件：id = ?
```

### 3.3 作品

#### 获取我的作品

```
表：works  |  操作：SELECT
查询条件：username = 当前用户
排序：created_at 降序
返回：作品记录数组
字段映射：cat_id→catId
```

#### 上传作品

```
表：works  |  操作：INSERT
请求参数：{ id, username, catId→cat_id, image, desc→description }
返回：{ id }
```

#### 删除作品

```
表：works  |  操作：DELETE
条件：id = ?
```

### 3.4 非遗投票

#### 获取投票统计

```
函数：get_interests()  |  操作：RPC
返回：{ [非遗名称]: 票数, ... }
说明：调用 PostgreSQL 存储函数，按票数降序
```

#### 投一票

```
表：interests  |  操作：INSERT
请求参数：{ ich_name, username }
说明：唯一约束(ich_name, username)保证每人每项仅一票
```

### 3.5 管理后台

以下接口均需管理员权限（localStorage 中 is_admin = true），非管理员调用直接抛出异常。

#### 获取数据概览

```
并行查询：
- users.count      → totalUsers
- bookings.count   → totalBookings
- works.*          → totalWorks, pendingWorks（统计 status='pending'）
- ich_content.count → totalContent
返回：{ totalUsers, totalBookings, totalWorks, pendingWorks, totalContent }
```

#### 获取所有用户

```
表：users + bookings + works  |  操作：SELECT
返回：用户数组，含 bookingCount 和 workCount（前端聚合计算）
说明：先查全量用户、全量预约、全量作品，再按 username 分组统计
```

#### 获取某用户的预约/作品

```
获取预约：bookings WHERE username = ? ORDER BY created_at DESC
获取作品：works WHERE username = ? ORDER BY created_at DESC
```

#### 获取所有预约

```
表：bookings  |  操作：SELECT ALL
排序：created_at 降序
```

#### 获取所有作品（可按状态筛选）

```
表：works  |  操作：SELECT
可选筛选：status = pending | approved | rejected
排序：created_at 降序
```

#### 更新作品审核状态

```
表：works  |  操作：UPDATE
条件：id = ?
更新字段：{ status }
```

#### 获取全部内容

```
表：ich_content  |  操作：SELECT ALL
排序：created_at 降序
```

#### 获取某分类内容

```
表：ich_content  |  操作：SELECT
条件：cat_id = ?
排序：created_at 降序
```

#### 创建内容

```
表：ich_content  |  操作：INSERT
请求参数：{ catId→cat_id, type, title, content, description }
```

#### 更新内容

```
表：ich_content  |  操作：UPDATE
条件：id = ?
更新字段：请求体中的字段 + updated_at 自动设当前时间
```

#### 删除内容

```
表：ich_content  |  操作：DELETE
条件：id = ?
```

### 3.6 消息通知

#### 发送通知

```
表：notifications  |  操作：INSERT
请求参数：{ fromAdmin→from_admin, toUser→to_user, title, message }
说明：to_user 为 null 表示全站广播
```

#### 获取我的通知

```
表：notifications  |  操作：SELECT
条件：to_user = 当前用户 OR to_user IS NULL（广播）
排序：created_at 降序，限 50 条
```

#### 获取已发送通知

```
表：notifications  |  操作：SELECT
条件：from_admin = 当前管理员
排序：created_at 降序，限 100 条
```

#### 标记已读

```
表：notifications  |  操作：UPDATE
条件：id = ?
更新字段：{ is_read: true }
```

#### 获取未读数量

```
表：notifications  |  操作：COUNT
条件：(to_user = 当前用户 OR to_user IS NULL) AND is_read = false
返回：未读数量
```

## 四、前端字段名映射

由于 JavaScript 习惯用 camelCase，PostgreSQL 习惯用 snake_case，前端在 api.js 中做了一层映射：

| 前端（camelCase） | 数据库（snake_case） |
|-------------------|---------------------|
| catId | cat_id |
| catName | cat_name |
| isAdmin | is_admin |
| isRead | is_read |
| fromAdmin | from_admin |
| toUser | to_user |
| createdAt | created_at |
| updatedAt | updated_at |

## 五、权限控制方案

```
                  ┌──────────────┐
                  │  用户请求     │
                  └──────┬───────┘
                         │
                  ┌──────▼───────┐
                  │ localStorage │
                  │ 读取 ich_user │
                  └──────┬───────┘
                         │
              ┌──────────▼──────────┐
              │ is_admin === true？  │
              └─────┬────────┬─────┘
                    │ 是      │ 否
              ┌─────▼──┐  ┌──▼──────┐
              │ 放行    │  │ 抛异常  │
              │ 执行SQL │  │"需管理员"│
              └────────┘  └─────────┘
```

管理员接口在 `api.js` 中用 `requireAdmin()` 函数做前置校验，从 localStorage 读取当前用户信息，检查 `is_admin` 字段。非管理员调用直接 throw Error，不会发出网络请求。

## 六、错误处理

| 错误类型 | HTTP 状态 | 处理方式 |
|---------|----------|---------|
| 用户名已存在 | 409（23505） | 提示"用户名已存在" |
| 用户名或密码错误 | 404/200空 | 提示"用户名或密码错误" |
| 无管理员权限 | — | 前端直接拦截，不请求网络 |
| Supabase 请求失败 | 4xx/5xx | error.message 提示 |
| 请求格式错误 | 400 | Supabase 自动校验 |
