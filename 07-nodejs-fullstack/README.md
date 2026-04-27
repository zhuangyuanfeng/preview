# Node.js 全栈

> 优先级：⭐⭐⭐⭐ | 时间：Week 3 主线
> 缩量决策：砍 Stream/Cluster/GraphQL/WebSocket，主攻 **Next.js 全栈 + Prisma + 鉴权**。

---

## 🗺️ 模块全景图

```
Node 全栈
   │
   ├── Next.js 全栈 ⭐⭐⭐
   │     ├── App Router / API Routes / Server Actions
   │     └── SSR / ISR / SSG 取舍
   │
   ├── 中间件原理 ⭐⭐
   │     └── Koa 洋葱模型（10 行手写）
   │
   ├── 数据库 ⭐⭐
   │     ├── Prisma + PostgreSQL（首选）
   │     └── Redis 缓存策略
   │
   └── 鉴权 ⭐⭐
         └── JWT + refresh token
```

---

## 🎯 核心概念（5 个必懂）

1. **Next.js 三种渲染模式**
   - SSR（Server-Side Rendering）：每次请求都渲染（数据高度动态）
   - SSG（Static Site Generation）：构建时渲染（博客/文档）
   - ISR（Incremental Static Regeneration）：构建时渲染 + 后台增量更新（电商详情页）
   - 选型口诀：**纯静态 → SSG / 用户相关 → SSR / 高并发但能接受短延迟 → ISR**

2. **Koa 洋葱模型（中间件原理）**
   - 中间件按注册顺序进入，按相反顺序出来
   - 实现核心：`compose` 用 `Promise.resolve().then(() => next())` 串起来
   - **10 行能手写**

3. **Server Actions（Next.js 14+）**
   - 'use server' 标记的函数，前端直接 import 调用
   - 编译时把函数变成 RPC，前端调用 → 实际是 POST 到服务端
   - 替代了一部分 API Routes 的需求

4. **JWT 鉴权流程**
   - 登录：用户名密码 → 服务端校验 → 颁发 access token (短期) + refresh token (长期)
   - 请求：Header 带 access token，服务端 verify
   - 续期：access 过期 → 用 refresh token 换新的 access
   - **不要把敏感信息塞 JWT 里**（payload 是 base64，可解码）

5. **Prisma 基本用法**
   - schema.prisma 定义模型 → `prisma generate` 生成 TS 类型
   - `prisma.user.findMany()` 这种 API（类型完全推断）
   - 迁移：`prisma migrate dev` / `prisma db push`

---

## 💪 必出 Demo

| Demo | 验证什么 |
|---|---|
| `koa-onion.js` | 10 行手写 Koa 中间件 compose |
| `next-fullstack/` | Next.js + Prisma + Postgres，跑通 CRUD |
| `jwt-auth/` | 登录 + access/refresh + 中间件鉴权 |

---

## 🎤 面试话术

### Q: Koa 洋葱模型怎么实现的？
> 核心是 compose 函数，把所有 middleware 串成一个链：
> ```js
> function compose(middlewares) {
>   return function(ctx) {
>     let index = -1
>     function dispatch(i) {
>       if (i <= index) return Promise.reject(new Error('next() called multiple times'))
>       index = i
>       const fn = middlewares[i]
>       if (!fn) return Promise.resolve()
>       return Promise.resolve(fn(ctx, () => dispatch(i + 1)))
>     }
>     return dispatch(0)
>   }
> }
> ```
> 关键是 `next()` 返回 Promise，让 await 形成"先进后出"的洋葱结构。

### Q: SSR、SSG、ISR 怎么选？
> 一句话：**ISR = SSG + 后台静默更新**。
> - 内容完全静态（文档/博客）→ SSG
> - 内容跟登录用户相关 → SSR
> - 内容有时效但能接受 1-5 分钟延迟（电商列表/详情）→ ISR
> 真实场景里，能用 ISR 一律用 ISR（CDN 命中率最高）。

### Q: JWT 为什么需要 refresh token？
> 安全和体验的折中：
> - access token 短期（15 分钟）：泄露影响小
> - refresh token 长期（7-30 天）：用户不用频繁登录
> - 续期：access 过期，用 refresh 换新的，refresh 一次性使用（用过就换新的）

---

## 📺 视觉学习资源

- 视频：[Lee Robinson - Next.js App Router 系列](https://www.youtube.com/@leerob)（Next.js 开发负责人）
- 文档：Next.js 官方 Tutorial（一晚搞完）
- 文档：Prisma Quickstart

---

## 🔧 工作痛点联动

如果你工作中：
- 接口字段对不上（前后端要打架）→ 用 Prisma + tRPC 体验全栈类型推断（这就是个 demo）
- 鉴权方案分散 → 写一篇你们公司鉴权的全链路图

---

## ⚠️ 避坑

- ❌ 不要研究 Stream / Cluster / GraphQL / WebSocket（不是高频）
- ❌ 不要花时间写 Express，直接用 Next.js（一举两得）
- ❌ 不要研究 SQL 优化（除非简历强调后端）
- ✅ 重点：**Next.js 全栈 + Prisma 体感 + 中间件原理 + JWT**
