# 框架源码（Vue3 + React）

> 优先级：⭐⭐⭐⭐⭐ | 时间：Week 2（5.5 - 5.11）
> 缩量决策：Vue3 只攻**响应式**，编译器/diff 只到"能讲概念"；React **能用 + 能讲 Hooks 设计哲学**，不读源码。

---

## 🗺️ 模块全景图

```
                       前端框架
                         │
            ┌────────────┴────────────┐
         Vue3                       React
       （读源码）                  （能用+讲清楚）
            │                          │
       响应式系统 ⭐⭐⭐              Hooks 设计 ⭐⭐⭐
       (reactive/effect)           (链表 + 闭包)
            │                          │
       编译器（讲概念）            Fiber 架构（讲概念）
       (PatchFlag/Block)           (时间切片/可中断)
            │                          │
       diff 算法（讲概念）          合成事件（讲概念）
       (双端 + LIS)
                         │
                    ┌────┴────┐
              对比话术      项目实战
              (面试常考)    (Next.js + AI)
```

---

## 🎯 核心概念（这 5 个必须能讲清）

### Vue3

1. **响应式系统**（最重要）
   - Proxy 怎么 track 依赖、trigger 更新
   - effect 函数的设计（push/pop activeEffect）
   - reactive vs ref vs shallowRef 的区别
   - **必出 Demo**：30 行内的 mini-reactive

2. **编译器优化**（讲概念即可）
   - 静态提升 / PatchFlag / Block Tree
   - 一句话：**Vue3 在编译时把"哪些会变"标记好，运行时只看标记**
   - 对比 Vue2：Vue2 运行时全量 diff，Vue3 编译时帮你跳过不变的

3. **diff 算法**（讲概念即可）
   - 双端 diff + 最长递增子序列
   - **不要去手写 LIS**，能讲清"为什么需要 LIS"就够了

### React

4. **Hooks 设计哲学**
   - 为什么 Hooks 是链表（fiber.memoizedState）
   - 为什么不能条件调用（链表顺序绑定）
   - useState 闭包陷阱（每次 render 形成新闭包）

5. **Fiber 架构（讲概念）**
   - 为什么需要：浏览器一帧 16ms，组件树太深会卡帧
   - 解决：把渲染拆成 fiber 节点，可中断、可恢复
   - 对比 Vue3：Vue3 是细粒度更新（不需要 Fiber），React 是组件级 reconcile（需要 Fiber 调度）

---

## 💪 必出 Demo（防听懂幻觉）

| Demo | 行数 | 验证什么 |
|---|---|---|
| `mini-reactive.js` | ~30 行 | 自己写出 Proxy 版响应式，能跑通 effect/track/trigger |
| `mini-ref.js` | ~15 行 | ref 包装值类型，理解 .value 设计 |
| `hooks-link.js` | ~40 行 | 模拟 React Hooks 链表，证明为什么不能条件调用 |
| `next-min-app/` | 1 个目录 | Next.js 最小项目，3 个 Hooks 用熟（useState/useEffect/useRef） |

每个 demo 写完要画一张「这玩意是怎么跑起来的」流程图。

---

## 🎤 面试话术（直接背）

### Q: Vue3 响应式比 Vue2 好在哪？

> 三点：
> 1. **拦截能力**：Proxy 能拦 13 种操作（含 has/delete/数组索引），Vue2 的 defineProperty 只能拦 get/set 且数组要 hack
> 2. **新增属性自动响应**：Vue3 不需要 Vue.set
> 3. **性能**：响应式按需触发，配合编译期 PatchFlag，运行时几乎只跑该跑的代码

### Q: 为什么 React Hooks 不能写在 if 里？

> Hooks 在 fiber 节点上是**链表存储**，按调用顺序绑定。
> 第一次 render 建立链表 [useState1, useEffect1, useState2]，
> 如果第二次 render 把第一个 useState 写在 if 里跳过了，
> useEffect 拿到的就是 useState1 的位置，state 全错。

### Q: Vue3 vs React 核心差异？

> 一句话：**响应式 vs 不可变**。
> - Vue3：你改数据，框架自己知道哪里要更新（细粒度）
> - React：你改数据，组件整体重跑，框架靠 Fiber 调度时间
> 衍生差异：Vue3 编译期优化多（PatchFlag），React 运行期机制多（Fiber/调度）。

---

## 📺 视觉学习资源

- **书**：霍春阳《Vue.js设计与实现》第 4-5 章（响应式系统，最高推荐）
- **视频**：B 站搜「黄轶 Vue3 响应式」或「Vue3 响应式 流程图」
- **视频**：[Lin Clark - A Cartoon Intro to Fiber](https://www.youtube.com/watch?v=ZCuYPiUIONs)
- **文章**：Dan Abramov [overreacted.io](https://overreacted.io/) Hooks 系列

---

## 🔧 工作痛点联动

如果你工作中用过 Vue（极大概率），本周可以做：
- 把 mini-reactive 包装成**调试工具**：监听某个对象的所有变化（dev 环境用）
- 这就是一个能讲的项目，写完你对响应式的理解会从"知道"变"刻进脑子"

---

## ⚠️ 避坑

- ❌ 不要去读 Vue3 编译器源码（性价比极低，2-3 周都看不完）
- ❌ 不要去读 React Fiber 源码（除非面 React Core 团队）
- ✅ 重点是**画流程图 + 写最小复现 demo**，不是读源码
- ✅ "讲清原理 + 能写 mini 实现" >>> "我看过源码 xxx 行"
