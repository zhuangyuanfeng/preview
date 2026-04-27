# 浏览器与网络

> 优先级：⭐⭐⭐⭐ | 时间：Week 3 穿插（碎片时间消化）
> 缩量决策：砍 TCP 滑动窗口/拥塞控制，HTTP 缓存和 HTTPS 握手必须能讲透。

---

## 🗺️ 模块全景图

```
URL 输入回车 → 看到页面
   │
   ├── DNS 解析
   │
   ├── TCP 三次握手（讲流程）
   │     └── 为什么三次：防止历史连接、确认双向通信
   │
   ├── TLS 握手（讲流程）⭐
   │     └── 1.2 vs 1.3 区别（RTT 数）
   │
   ├── HTTP 请求 ⭐⭐⭐
   │     ├── 强缓存 / 协商缓存
   │     ├── HTTP/1.1 vs 2 vs 3 差异
   │     └── 跨域：CORS 完整机制
   │
   └── 浏览器渲染 ⭐⭐
         └── DOM/CSSOM/RenderTree → Layout → Paint → Composite
                                    └── 关键渲染路径优化
```

---

## 🎯 核心概念（6 个必懂）

1. **HTTP 缓存（最高频）**
   - 强缓存：Cache-Control（max-age） / Expires，**不发请求**
   - 协商缓存：If-None-Match（ETag） / If-Modified-Since（Last-Modified），**发请求但 304 不下载**
   - 完整流程：先查强缓存 → 失效则发请求带 If-* → 304 用本地，200 下载新的

2. **HTTPS 握手流程**
   - TLS 1.2：4 步（client hello → server hello+证书 → 客户端验证证书+生成预主密钥+用公钥加密发回 → 双方算出会话密钥 → 应用数据用对称加密）
   - TLS 1.3：1-RTT，性能更好
   - 关键点：**非对称加密只用于交换对称密钥，实际通信是对称加密**

3. **HTTP/1.1 vs 2 vs 3**
   - 1.1：一个 TCP 一次只发一个请求（队头阻塞），keep-alive 复用 TCP
   - 2：多路复用（一个 TCP 跑多个 stream），头部压缩 HPACK
   - 3：基于 UDP（QUIC），解决 TCP 队头阻塞，0-RTT 重连

4. **CORS 完整机制**
   - 简单请求：直接发，看 Response 的 Access-Control-Allow-Origin
   - 复杂请求：先发 OPTIONS 预检（带 Access-Control-Request-Method/Headers），通过才发真请求
   - 触发预检的条件：非 GET/POST/HEAD、Content-Type 非三种简单类型、自定义 Header

5. **从 URL 到页面的完整流程**
   - DNS → TCP → TLS → HTTP → 解析 HTML → 构建 DOM/CSSOM → RenderTree → Layout → Paint → Composite
   - 各阶段的优化点：DNS 预解析、HTTP/2、关键 CSS 内联、defer/async、tree-shaking

6. **XSS / CSRF 防御**
   - XSS（跨站脚本）：转义 + CSP + httpOnly cookie
   - CSRF（跨站请求伪造）：CSRF Token + SameSite cookie + 二次验证

---

## 💪 必出 Demo

| Demo | 验证什么 |
|---|---|
| `cache-test/` | 一个最小 HTTP 服务，演示 304 / 200 from cache 各场景 |
| `cors-test.html` | OPTIONS 预检在 Network 面板的样子 |
| `xss-defense.html` | 模拟 XSS 注入 → 加 CSP 后被拦的对比 |

不要求自己搭，**用 Network 面板录屏 + 标注**也算 demo。

---

## 🎤 面试话术

### Q: 强缓存和协商缓存区别？
> 强缓存：浏览器**不发请求**，看 Cache-Control 和 Expires 还没过期就直接用。
> 协商缓存：浏览器**发请求**，带上 If-None-Match（基于 ETag）或 If-Modified-Since，服务器返回 304 表示没变，浏览器用本地副本。
> 顺序：先查强缓存 → 失效才走协商。

### Q: HTTPS 怎么保证安全？
> 三层：身份认证（证书）+ 密钥交换（非对称）+ 数据加密（对称）。
> 流程：客户端验证服务器证书 → 用服务器公钥加密一个预主密钥发回去 → 双方各自算出会话密钥 → 之后用对称加密通信。
> **非对称只用一次（交换密钥），实际数据用对称加密（性能更好）**。

### Q: 跨域怎么解？
> 三种方案：
> 1. CORS（最常用）：服务器设 Access-Control-Allow-Origin
> 2. 代理：开发时用 webpack devServer，生产用 Nginx 转发
> 3. JSONP（已过时）：利用 script 标签不受同源限制，但只支持 GET

### Q: XSS 怎么防？
> 三道防线：
> 1. 输入：转义所有用户输入（&lt; &gt; &amp; 等）
> 2. CSP：Content-Security-Policy 限制脚本来源
> 3. cookie：敏感 cookie 加 httpOnly，JS 拿不到

---

## 📺 视觉学习资源

- 视频：B 站搜「HTTPS 握手 流程图」
- 文章：阮一峰「HTTP 协议」系列
- 工具：Chrome DevTools Network 面板（实操比看文章有用 10 倍）

---

## 🔧 工作痛点联动

如果你工作中遇到过：
- 缓存导致的线上 bug → 写一篇「缓存调优 checklist」
- 跨域配置坑 → 整理团队的"接口跨域排查指南"
- 报错日志一堆 CORS 字眼 → 用 AI 自动分类报错日志的痛点项目

---

## ⚠️ 避坑

- ❌ 不要深挖 TCP 滑动窗口、拥塞控制（性价比极低）
- ❌ 不要花时间记 HTTP 状态码全表（常见的 200/301/302/304/400/401/403/404/500/502/503/504 够了）
- ✅ 重点：**HTTP 缓存 + HTTPS 握手 + CORS 三件套**
