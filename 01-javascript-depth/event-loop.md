# 事件循环（Event Loop）

## 一句话概念

JavaScript 是单线程的，事件循环是它处理异步任务的机制——决定了代码的执行顺序。

---

## 核心模型

```
┌─────────────────────────────┐
│         调用栈 (Call Stack)    │  ← 同步代码在这里执行，一次只能执行一个
└─────────────┬───────────────┘
              │ 栈空了？检查队列
              ▼
┌─────────────────────────────┐
│       微任务队列 (Microtask)   │  ← Promise.then / await 后面的代码 / MutationObserver
│       优先级：高，清空才走下一步  │
└─────────────┬───────────────┘
              │ 微任务全部清空了？
              ▼
┌─────────────────────────────┐
│       宏任务队列 (Macrotask)   │  ← setTimeout / setInterval / I/O / UI渲染
│       每次只取一个              │
└─────────────────────────────┘
```

### 执行规则（背下来）

1. 执行同步代码（调用栈）
2. 调用栈空了 → 清空所有微任务
3. 微任务清空了 → 取一个宏任务执行
4. 回到第 2 步

**关键：微任务比宏任务优先，而且是全部清空，不是只取一个。**

---

## 微任务 vs 宏任务

| 微任务 (Microtask) | 宏任务 (Macrotask) |
|---|---|
| Promise.then / catch / finally | setTimeout / setInterval |
| await 后面的代码 | DOM 事件回调（click等） |
| MutationObserver | requestAnimationFrame |
| queueMicrotask() | I/O 操作 |

---

## 练习题（由浅入深）

### 第1题：基础

```javascript
console.log('1')

setTimeout(() => {
  console.log('2')
}, 0)

Promise.resolve().then(() => {
  console.log('3')
}).then(() => {
  console.log('4')
})

console.log('5')
```

<details>
<summary>点击看答案</summary>

输出：`1 5 3 4 2`

分析：
1. `console.log('1')` → 同步，直接执行 → 输出 **1**
2. `setTimeout` → 回调扔进**宏任务**队列
3. `Promise.resolve().then` → 回调扔进**微任务**队列
4. `console.log('5')` → 同步，直接执行 → 输出 **5**
5. 同步代码执行完，开始清微任务：
   - 执行第一个 `.then` → 输出 **3**，第二个 `.then` 加入微任务队列
   - 执行第二个 `.then` → 输出 **4**
6. 微任务清空，取宏任务：
   - 执行 `setTimeout` 回调 → 输出 **2**
</details>

---

### 第2题：setTimeout vs Promise

```javascript
setTimeout(() => {
  console.log('A')
}, 0)

new Promise((resolve) => {
  console.log('B')
  resolve()
}).then(() => {
  console.log('C')
})

console.log('D')
```

<details>
<summary>点击看答案</summary>

输出：`B D C A`

分析：
1. `setTimeout` → 回调扔进宏任务队列
2. `new Promise(executor)` → **executor 是同步执行的！** → 输出 **B**，调用 resolve()
3. `.then` → 回调扔进微任务队列
4. `console.log('D')` → 同步 → 输出 **D**
5. 清微任务 → 输出 **C**
6. 取宏任务 → 输出 **A**

**易错点：`new Promise` 的构造函数参数是同步执行的，只有 `.then` 才是微任务。**
</details>

---

### 第3题：async/await

```javascript
async function foo() {
  console.log('foo start')
  await bar()
  console.log('foo end')
}

async function bar() {
  console.log('bar')
}

console.log('script start')
foo()
console.log('script end')
```

<details>
<summary>点击看答案</summary>

输出：`script start` → `foo start` → `bar` → `script end` → `foo end`

分析：
1. `console.log('script start')` → 同步 → 输出 **script start**
2. 调用 `foo()`：
   - `console.log('foo start')` → 同步 → 输出 **foo start**
   - `await bar()` → 先执行 `bar()`（同步）→ 输出 **bar**
   - `await` 后面的代码 `console.log('foo end')` 变成微任务
3. `console.log('script end')` → 同步 → 输出 **script end**
4. 清微任务 → 输出 **foo end**

**关键理解：`await xxx` 等价于 `xxx.then(() => { 后面的代码 })`**

也就是说：
```javascript
await bar()
console.log('foo end')
// 等价于
bar().then(() => {
  console.log('foo end')
})
```
</details>

---

### 第4题：嵌套 Promise

```javascript
Promise.resolve().then(() => {
  console.log('1')
  Promise.resolve().then(() => {
    console.log('2')
  })
}).then(() => {
  console.log('3')
})
```

<details>
<summary>点击看答案</summary>

输出：`1 2 3`

分析：
1. 外层 `.then(() => { ... })` 加入微任务队列 → 队列：[外层then]
2. 执行外层 then：
   - 输出 **1**
   - 内层 `Promise.resolve().then` 加入微任务队列 → 队列：[内层then]
   - 外层第二个 `.then` 加入微任务队列 → 队列：[内层then, 外层第二个then]
3. 继续清微任务：
   - 执行内层 then → 输出 **2** → 队列：[外层第二个then]
   - 执行外层第二个 then → 输出 **3**

**关键：微任务中产生的新微任务，会在当前这轮微任务清空过程中执行，不会等到下一轮。**
</details>

---

### 第5题：综合（面试难度）

```javascript
console.log('1')

setTimeout(() => {
  console.log('2')
  Promise.resolve().then(() => {
    console.log('3')
  })
}, 0)

Promise.resolve().then(() => {
  console.log('4')
  setTimeout(() => {
    console.log('5')
  }, 0)
})

console.log('6')
```

<details>
<summary>点击看答案</summary>

输出：`1 6 4 2 3 5`

分析：
1. `console.log('1')` → 同步 → 输出 **1**
2. 第一个 `setTimeout` → 回调进宏任务队列 → 宏：[timer1]
3. `Promise.resolve().then` → 回调进微任务队列 → 微：[promise1]
4. `console.log('6')` → 同步 → 输出 **6**
5. 清微任务：
   - 执行 promise1 → 输出 **4**，`setTimeout` 进宏任务队列 → 宏：[timer1, timer2]
6. 取一个宏任务（timer1）：
   - 输出 **2**
   - `Promise.resolve().then` 进微任务 → 微：[promise2]
7. 清微任务：
   - 执行 promise2 → 输出 **3**
8. 取一个宏任务（timer2）：
   - 输出 **5**
</details>

---

## 面试回答模板

> "JavaScript 是单线程语言，通过事件循环处理异步。执行顺序是：先执行同步代码，同步代码执行完后清空微任务队列（Promise.then、await），微任务全部清空后再取一个宏任务（setTimeout、I/O）执行。每执行完一个宏任务，都要再检查并清空微任务。这就是为什么 Promise 总是比 setTimeout 先执行。"

> 追问 async/await：
> "await 本质上是 Promise 的语法糖，`await xxx` 后面的代码相当于放在 `xxx.then()` 的回调里，所以是微任务。"

---

## 进阶：Node.js 的事件循环（了解即可）

Node.js 的事件循环比浏览器多了几个阶段：

```
   ┌───────────────────────┐
┌─>│        timers          │  ← setTimeout/setInterval
│  └──────────┬────────────┘
│  ┌──────────▼────────────┐
│  │     pending callbacks │
│  └──────────┬────────────┘
│  ┌──────────▼────────────┐
│  │       poll             │  ← I/O 回调
│  └──────────┬────────────┘
│  ┌──────────▼────────────┐
│  │       check            │  ← setImmediate
│  └──────────┬────────────┘
│  ┌──────────▼────────────┐
│  │     close callbacks   │
│  └──────────┬────────────┘
└─────────────┘
```

面试只需要知道：
- `process.nextTick` 优先级高于 `Promise.then`
- `setImmediate` 在 check 阶段执行
- 大部分情况下和浏览器表现一致
