# 前端工程化（缩量版）

> 优先级：⭐⭐⭐ | 时间：Week 3 后半段
> 缩量决策：砍**手写 Loader/Plugin、Monorepo、微前端**，只攻 Webpack/Vite 原理 + Tree Shaking。

---

## 🗺️ 模块全景图

```
前端工程化
   │
   ├── 构建工具 ⭐⭐⭐
   │     ├── Webpack（流程 / loader-plugin / tree-shaking）
   │     ├── Vite（为什么快：ESM + esbuild）
   │     └── 对比：构建型 vs 原生 ESM
   │
   ├── 代码质量（碎片时间）
   │     ├── ESLint / Prettier
   │     └── Husky + lint-staged
   │
   └── 部署（碎片时间）
         └── Vercel / Nginx 基础
```

---

## 🎯 核心概念（4 个必懂）

1. **Webpack 完整流程**
   - 初始化（读 config，注册 plugin）
   - 编译（从 entry 出发，遇到 import → 调用 loader → 转成 JS → 收集依赖图）
   - 输出（chunk 分割 → 生成 bundle）
   - 关键：**loader 转换文件，plugin 介入构建过程的钩子**

2. **Tree Shaking 原理**
   - 基于 ESM 静态分析（import/export 必须在顶层）
   - 标记未使用的 export → 压缩阶段删除
   - 失效场景：CommonJS 模块、副作用代码（package.json 的 sideEffects）

3. **Vite 为什么快**
   - 开发：原生 ESM（浏览器直接加载源码模块），无需打包
   - 依赖预构建：用 esbuild 把 node_modules 预打包成 ESM
   - HMR：精确到模块（只重新拉变化的那个模块）
   - 生产：用 Rollup 打包（开发用 ESM，生产用 Rollup）

4. **HMR 原理**
   - WebSocket 连接 dev server
   - 文件变化 → 服务端通知客户端 → 客户端拉新模块 → 替换执行
   - 关键：**模块要支持 HMR API（accept/dispose）**，框架（Vue/React）已经包装好了

---

## 💪 必出 Demo

| Demo | 验证什么 |
|---|---|
| `webpack-min/` | 最小 webpack 配置（一个 loader + 一个 plugin），能跑 |
| `vite-vs-webpack-flow.png` | 一张对比图：Webpack 启动 vs Vite 启动的流程差异 |

**不要求**手写 Loader/Plugin，**画图能讲清就够**。

---

## 🎤 面试话术

### Q: Webpack 完整构建流程？
> 三阶段：
> 1. **初始化**：读 config，注册所有 plugin（plugin 监听 hooks）
> 2. **编译**：从 entry 开始，走 loader 链把每个文件转成 JS，收集 import 依赖，递归处理
> 3. **输出**：根据 splitChunks 切 chunk，生成最终 bundle
> 中间穿插：plugin 在每个 hook 上介入（编译前/后、emit 前/后等）

### Q: Vite 为什么比 Webpack 快？
> 两个核心：
> 1. **开发不打包**：用浏览器原生 ESM，文件改动只重新拉那一个模块（Webpack 要重新走依赖图）
> 2. **依赖预构建用 esbuild**：esbuild 是 Go 写的，比 webpack 的 JS 工具链快 10-100 倍
> 但生产构建 Vite 还是用 Rollup（Rollup 在 tree-shaking 上更成熟）

### Q: Tree Shaking 失效的常见原因？
> 1. 用了 CommonJS 模块（require）：CJS 是动态的，没法静态分析
> 2. package.json 没标 sideEffects: false
> 3. import * as Lib（整个命名空间导入，分析不出用了哪些）
> 4. 副作用代码（顶层 console.log、修改全局对象）

### Q: HMR 是怎么实现的？
> WebSocket 通信 + 模块替换。dev server 监听文件变化，通过 WebSocket 通知浏览器，浏览器拉新模块替换。框架（Vue/React）的 HMR 接口实现了"替换模块时保留组件状态"。

---

## 📺 视觉学习资源

- 视频：B 站搜「Webpack 工作原理 详解」
- 文章：「为什么 Vite 这么快」（多个版本，挑可视化好的）

---

## 🔧 工作痛点联动

如果你工作中：
- 项目构建慢 → 用 webpack-bundle-analyzer 出一份分析图（这本身就是个项目）
- 老项目从 Webpack 迁 Vite → 写一篇迁移记录（面试可讲）
- CI 里前端构建吃资源 → 优化构建配置 + 加缓存

---

## ⚠️ 避坑

- ❌ 不要去手写 Loader/Plugin（说原理就够，没人考你写完整代码）
- ❌ 不要研究 Module Federation / Monorepo（除非简历有相关经验）
- ❌ 不要背 Webpack 所有 plugin（用过几个就讲几个）
- ✅ 重点：**Webpack 三阶段流程 + Vite 快在哪 + Tree Shaking 失效场景**
