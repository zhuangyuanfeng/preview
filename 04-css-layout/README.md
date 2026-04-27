# CSS 布局与动画（缩量版）

> 优先级：⭐⭐ | 时间：穿插，不占主线
> 缩量决策：8 年经验已经够用，**只补面试高频题 + 1px 边框 + 性能相关**。

---

## 🗺️ 模块全景图

```
CSS 面试核心
   │
   ├── 布局（用得多，但面试问得少）
   │     └── BFC / Flex / Grid / 居中 5 种
   │
   ├── 性能（高频考） ⭐
   │     ├── 回流 vs 重绘
   │     ├── transform 为什么比 top/left 快（GPU 合成层）
   │     └── will-change 的正确使用
   │
   └── 高频小问题 ⭐
         ├── 1px 边框
         └── 选择器优先级
```

---

## 🎯 核心概念（5 个必懂）

1. **回流 vs 重绘**
   - 回流（reflow）：几何变化（宽高/位置）触发 → 全树重新计算 layout
   - 重绘（repaint）：外观变化（颜色/可见性）→ 不变 layout 只重画
   - 性能口诀：**改 transform/opacity 只触发 composite，不回流不重绘**

2. **transform vs top/left 性能差异**
   - top/left：触发 layout + paint
   - transform：直接走 composite layer（GPU 合成）
   - 这是为什么动画一律用 transform 的原因

3. **BFC（块格式化上下文）**
   - 触发条件 5 种：float / overflow≠visible / display:flex|grid|table-cell / position:absolute|fixed
   - 用途：清浮动 / 防 margin 折叠 / 自适应两栏

4. **居中 5 种方案（必背）**
   - flex: `display:flex; justify-content:center; align-items:center`
   - grid: `display:grid; place-items:center`
   - absolute + transform: `top:50%; left:50%; transform:translate(-50%,-50%)`
   - margin auto + flex: 父 flex，子 `margin:auto`
   - line-height = height（仅文本垂直居中）

5. **1px 边框问题**
   - 高分屏物理像素 ≠ CSS 像素，1px 边框看着粗
   - 解法：`transform:scaleY(0.5)` + `transform-origin:0 0`
   - 或者用 `box-shadow: 0 0.5px 0 #ccc`

---

## 💪 必出 Demo

| Demo | 验证什么 |
|---|---|
| `centering.html` | 5 种居中方案各做一个，并排放 |
| `reflow-vs-repaint.html` | 用 Performance 面板录一遍，看 layout/paint/composite |
| `1px-border.html` | 真机/模拟器对比有/无方案的 1px 差异 |

---

## 🎤 面试话术

### Q: 动画为什么用 transform？
> transform 走合成层，不触发 layout 和 paint，直接由 GPU 合成。top/left 会触发 layout（回流），重排所有受影响节点。一帧 16ms，layout 几毫秒就吃掉了，掉帧就是这么来的。

### Q: BFC 是啥？
> 块格式化上下文，是一块**独立的渲染区域**。区域内布局不影响外部，外部也进不来。所以能用来：
> 1. 清浮动（父级 BFC，浮动子元素被包住）
> 2. 防 margin 重叠（相邻 BFC 不合并 margin）
> 3. 两栏自适应（左浮动，右 overflow:auto 触发 BFC）

### Q: 1px 边框为什么会粗？怎么解？
> 设计稿 1px 在 dpr=2/3 屏幕上对应 2-3 物理像素，所以看着粗。
> 解法用 `transform:scaleY(0.5)` 配合 `:before/:after` 伪元素，把伪元素的 1px 缩到 0.5px 视觉。

---

## 📺 视觉学习资源

- [CSS Tricks - Centering](https://css-tricks.com/centering-css-complete-guide/) （居中大全）
- 张鑫旭博客（中文 CSS 圣经）

---

## 🔧 工作痛点联动

不强制，CSS 这块更适合**速记 + 平时工作中复用**。

---

## ⚠️ 避坑

- ❌ 不要花时间记 Grid 的所有属性，会用 flex + 几个 grid 关键字就够
- ❌ 不要深挖移动端适配（rem/vw 选一个能讲就行）
- ✅ 重点是**性能 + 居中 + BFC** 三件套
