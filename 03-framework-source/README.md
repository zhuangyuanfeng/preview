# 框架源码

> 优先级：⭐⭐⭐⭐⭐ | 建议时间：第2-4周

## Vue3 源码（主力，必须讲透）

### 1. 响应式系统（最高优先级）
- [ ] Proxy vs Object.defineProperty 的本质差异
- [ ] reactive / ref / shallowRef 的实现
- [ ] 依赖收集（track）与触发更新（trigger）完整流程
- [ ] effect 副作用函数的设计
- [ ] computed 的懒计算与缓存机制
- [ ] watch / watchEffect 的实现差异

### 2. 编译器（高优先级）
- [ ] 模板编译三阶段：parse → transform → codegen
- [ ] 静态提升（hoistStatic）
- [ ] PatchFlag 标记与靶向更新
- [ ] Block Tree 设计思路
- [ ] v-if / v-for 编译产物分析

### 3. 虚拟 DOM 与 Diff
- [ ] VNode 结构设计
- [ ] patch 过程（mountElement / patchElement）
- [ ] 双端 diff + 最长递增子序列优化
- [ ] key 的作用（对比 React 的 diff 策略）

### 4. 组件系统
- [ ] 组件渲染流程（setup → render → patch）
- [ ] Props / Emit 的实现
- [ ] Slots 的编译与运行时
- [ ] 生命周期钩子的调用时机
- [ ] KeepAlive 缓存原理

### 5. 其他核心模块
- [ ] nextTick 的实现（微任务队列）
- [ ] Teleport / Suspense 实现思路
- [ ] 自定义指令的执行时机

### 学习方法
- 推荐：先看霍春阳《Vue.js设计与实现》，再对照源码
- 每个模块画一张流程图
- 准备 2-3 个能展示源码理解深度的面试回答

---

## React（能用 + 能说清核心概念）

> 目标不是读源码，而是：能写项目 + 面试时能对比 Vue 讲清差异

### 1. 上手使用（第3周，1周时间）
- [ ] JSX 语法与 Vue template 的思维差异
- [ ] 函数组件 + Hooks 基本使用
- [ ] useState / useEffect / useRef / useMemo / useCallback
- [ ] React Router v6 基础
- [ ] 状态管理：Zustand（最轻量，快速上手）

### 2. 核心概念（能讲清楚，不用读源码）
- [ ] Fiber 架构：为什么需要、解决了什么问题
- [ ] 时间切片与可中断渲染（对比 Vue 的同步渲染）
- [ ] Hooks 链表结构（为什么不能条件调用）
- [ ] 合成事件系统（对比 Vue 的原生事件代理）
- [ ] 并发模式（useTransition / Suspense）

### 3. Vue vs React 对比话术（面试高频）
- [ ] 响应式 vs 不可变数据（核心哲学差异）
- [ ] 模板编译 vs JSX（编译时 vs 运行时优化）
- [ ] 细粒度更新 vs Fiber 调度
- [ ] Composition API vs Hooks 的异同
- [ ] 性能优化策略的差异

### 实战
- [ ] 用 Next.js 做 AI 项目（一举两得：练 React + 做 AI 项目）

---

## 微信小程序（包装成架构经验）

> 你有近2年深度使用经验，这是优势，要包装成系统性的技术思考

### 面试中要能讲的
- [ ] 小程序双线程架构（渲染层 WebView + 逻辑层 JsCore）
- [ ] 与 Web 的核心差异（为什么不能操作 DOM）
- [ ] 性能优化实践（setData 优化、长列表、分包加载）
- [ ] 跨端方案经验（Taro/uni-app 的编译原理，如果用过）
- [ ] 小程序工程化（CI/CD、多环境、版本管理）
- [ ] 遇到的坑与解决方案（真实经验最有说服力）
