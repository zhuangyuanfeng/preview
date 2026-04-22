#!/usr/bin/env node
/**
 * 伪装成开发工具的终端复习器
 * 用法：node review.js [主题]
 *
 * node review.js          → 列出所有主题
 * node review.js event    → 事件循环
 * node review.js promise  → Promise
 * node review.js deep     → 深拷贝
 * node review.js debounce → 防抖节流
 * node review.js call     → call/bind
 * node review.js algo     → 算法总结
 * node review.js weak     → 薄弱点回顾
 *
 * 快捷方式：alias rr="node ~/preview/review.js"
 */

const topics = {
  event: {
    title: 'EventLoop Module - Unit Test Results',
    content: [
      { type: 'info', text: '══ 1. 场景：为什么需要事件循环？ ══' },
      { type: 'log',  text: '想象你在餐厅点餐：' },
      { type: 'log',  text: '  同步模型：厨师做一道菜时，服务员站在厨房门口等，其他客人都没人管' },
      { type: 'log',  text: '  异步模型：服务员把单子交给厨房，继续服务其他客人，菜好了再端过去' },
      { type: 'log',  text: 'JS 是单线程的（只有一个服务员），但通过事件循环实现"不傻等"' },
      { type: 'info', text: '── 日常例子 ──' },
      { type: 'code', text: '// 用户点击按钮 → 发请求 → 请求回来前页面不能卡死' },
      { type: 'code', text: 'button.onclick = async () => {' },
      { type: 'code', text: '  showLoading()                    // 同步：立即执行' },
      { type: 'code', text: '  const data = await fetch("/api")  // 异步：挂起，去处理其他事' },
      { type: 'code', text: '  render(data)                      // 微任务：请求回来后执行' },
      { type: 'code', text: '}' },
      { type: 'log',  text: '如果没有事件循环，await 那行就会冻结整个页面' },
      { type: 'info', text: '══ 2. 原理：事件循环怎么工作？ ══' },
      { type: 'log',  text: '浏览器维护三个"区域"：' },
      { type: 'pass', text: '调用栈(Call Stack)：正在执行的同步代码，一行一行跑' },
      { type: 'pass', text: '微任务队列(Microtask)：Promise.then, await, queueMicrotask' },
      { type: 'pass', text: '宏任务队列(Macrotask)：setTimeout, setInterval, I/O, UI渲染' },
      { type: 'info', text: '── 循环规则（背到条件反射）──' },
      { type: 'log',  text: '① 执行所有同步代码（调用栈清空）' },
      { type: 'log',  text: '② 清空所有微任务（一个不留，包括微任务中新产生的微任务）' },
      { type: 'log',  text: '③ 取一个宏任务执行' },
      { type: 'log',  text: '④ 回到 ② 继续' },
      { type: 'warn', text: 'KEY: 微任务是"插队的VIP"，只要有微任务就先处理完，宏任务排后面' },
      { type: 'info', text: '── 为什么微任务优先？ ──' },
      { type: 'log',  text: 'Promise 是"已经知道结果的事"（网络请求回来了），应该尽快处理' },
      { type: 'log',  text: 'setTimeout 是"安排在未来的事"（定时器到了），不急' },
      { type: 'info', text: '══ 3. 练习：输出顺序题 ══' },
      { type: 'info', text: '── 练习 1: 基础（必须秒答）──' },
      { type: 'code', text: 'console.log(1)' },
      { type: 'code', text: 'setTimeout(() => console.log(2), 0)' },
      { type: 'code', text: 'Promise.resolve().then(() => console.log(3))' },
      { type: 'code', text: 'console.log(4)' },
      { type: 'pass', text: 'answer: 1 4 3 2' },
      { type: 'log',  text: '分析：1,4同步 → 3微任务(Promise.then) → 2宏任务(setTimeout)' },
      { type: 'info', text: '── 练习 2: async/await ──' },
      { type: 'code', text: 'async function foo() {' },
      { type: 'code', text: '  console.log(1)' },
      { type: 'code', text: '  await Promise.resolve()' },
      { type: 'code', text: '  console.log(2)' },
      { type: 'code', text: '}' },
      { type: 'code', text: 'foo()' },
      { type: 'code', text: 'console.log(3)' },
      { type: 'pass', text: 'answer: 1 3 2' },
      { type: 'log',  text: 'await 后面的代码 = .then(callback) = 微任务' },
      { type: 'log',  text: 'foo()同步执行到await → 让出控制权 → 3同步 → 2微任务' },
      { type: 'info', text: '── 练习 3: 嵌套 Promise（进阶）──' },
      { type: 'code', text: 'Promise.resolve().then(() => {' },
      { type: 'code', text: '  console.log(1)' },
      { type: 'code', text: '  Promise.resolve().then(() => console.log(2))' },
      { type: 'code', text: '}).then(() => console.log(3))' },
      { type: 'pass', text: 'answer: 1 2 3' },
      { type: 'log',  text: '执行外层.then时，内层.then(2)立即入微任务队列' },
      { type: 'log',  text: '外层.then执行完后，链式.then(3)才入队 → 2比3先入队' },
      { type: 'warn', text: '规则：微任务中产生的新微任务，在当前轮次就执行（不等宏任务）' },
      { type: 'info', text: '── 练习 4: 综合（面试真题）──' },
      { type: 'code', text: 'console.log("start")' },
      { type: 'code', text: 'setTimeout(() => console.log("timeout"), 0)' },
      { type: 'code', text: 'new Promise(resolve => {' },
      { type: 'code', text: '  console.log("promise")    // new Promise 的 executor 是同步的！' },
      { type: 'code', text: '  resolve()' },
      { type: 'code', text: '}).then(() => console.log("then"))' },
      { type: 'code', text: 'console.log("end")' },
      { type: 'pass', text: 'answer: start promise end then timeout' },
      { type: 'log',  text: 'start,promise,end同步 → then微任务 → timeout宏任务' },
      { type: 'warn', text: 'TRAP: new Promise(fn) 中的 fn 是同步执行的！不是异步！' },
      { type: 'info', text: '── Node.js 差异（了解即可）──' },
      { type: 'log',  text: 'process.nextTick > Promise.then > setTimeout > setImmediate' },
      { type: 'warn', text: 'nextTick 优先级高于 Promise.then，但浏览器中没有 nextTick' },
      { type: 'info', text: '══ 4. 练习指导 ══' },
      { type: 'pass', text: '今晚：练习1-4不看答案写出来，每题限时1分钟' },
      { type: 'pass', text: '明天：自己编一道嵌套题，写出答案验证' },
      { type: 'pass', text: '面试前：能用"餐厅服务员"类比30秒讲清楚事件循环' },
    ]
  },

  promise: {
    title: 'Promise Implementation - Build Verification',
    content: [
      { type: 'info', text: '══ 1. 场景：回调地狱 ══' },
      { type: 'code', text: '// 没有 Promise 的年代：' },
      { type: 'code', text: 'login(user, (token) => {' },
      { type: 'code', text: '  getProfile(token, (profile) => {' },
      { type: 'code', text: '    getOrders(profile.id, (orders) => {' },
      { type: 'code', text: '      // 三层嵌套，继续加功能就更深...' },
      { type: 'code', text: '    })' },
      { type: 'code', text: '  })' },
      { type: 'code', text: '})' },
      { type: 'log',  text: 'Promise 让异步代码变成链式调用，不再无限嵌套：' },
      { type: 'code', text: 'login(user).then(getProfile).then(getOrders).then(render)' },
      { type: 'info', text: '══ 2. 原理：Promise 是个状态机 ══' },
      { type: 'log',  text: '想象一个外卖订单：' },
      { type: 'log',  text: '  pending    → 骑手还没送到（等待中）' },
      { type: 'log',  text: '  fulfilled  → 送到了，拿到外卖（成功，带值）' },
      { type: 'log',  text: '  rejected   → 商家取消了（失败，带原因）' },
      { type: 'pass', text: '规则1: 状态只能 pending→fulfilled 或 pending→rejected，不可逆' },
      { type: 'pass', text: '规则2: new Promise(fn) 中的 fn 是同步执行的' },
      { type: 'pass', text: '规则3: .then 的回调是异步的（微任务）' },
      { type: 'info', text: '── 核心问题：then 调用时结果可能还没出来 ──' },
      { type: 'code', text: 'const p = new Promise(resolve => {' },
      { type: 'code', text: '  setTimeout(() => resolve("done"), 1000)  // 1秒后才有结果' },
      { type: 'code', text: '})' },
      { type: 'code', text: 'p.then(val => console.log(val))  // then 立即执行，但此刻还没 resolve' },
      { type: 'log',  text: '问题：then 执行时 state 还是 pending，回调往哪放？' },
      { type: 'pass', text: '答案：pending 时存数组，等 resolve 时再执行 → 发布订阅模式' },
      { type: 'info', text: '══ 3. 分步实现 ══' },
      { type: 'info', text: '── Step 1: 骨架 ──' },
      { type: 'code', text: 'class MyPromise {' },
      { type: 'code', text: '  constructor(executor) {' },
      { type: 'code', text: '    this.state = "pending"' },
      { type: 'code', text: '    this.value = undefined' },
      { type: 'code', text: '    this.callbacks = []              // 存 then 注册的回调' },
      { type: 'code', text: '    const resolve = (val) => {' },
      { type: 'code', text: '      if (this.state !== "pending") return  // 状态不可逆' },
      { type: 'code', text: '      this.state = "fulfilled"' },
      { type: 'code', text: '      this.value = val' },
      { type: 'code', text: '      this.callbacks.forEach(fn => fn())    // 通知所有等待者' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '    executor(resolve, reject)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'info', text: '── Step 2: then ──' },
      { type: 'code', text: 'then(onFulfilled) {' },
      { type: 'code', text: '  if (this.state === "fulfilled") {' },
      { type: 'code', text: '    onFulfilled(this.value)         // 已完成 → 直接执行' },
      { type: 'code', text: '  } else {' },
      { type: 'code', text: '    this.callbacks.push(            // 未完成 → 存起来等通知' },
      { type: 'code', text: '      () => onFulfilled(this.value) // ⚠️ 必须是箭头函数包裹！' },
      { type: 'code', text: '    )' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'info', text: '── 你踩过的两个坑 ──' },
      { type: 'err',  text: 'TRAP 1: push(onFulfilled()) ← 加了() 导致立即调用！' },
      { type: 'log',  text: '  正确: push(() => onFulfilled(this.value))  用箭头函数包裹' },
      { type: 'err',  text: 'TRAP 2: fulfilled 时也 push 到数组，但没人触发了' },
      { type: 'log',  text: '  正确: fulfilled 时直接执行回调，不要存数组' },
      { type: 'warn', text: '记忆口诀: "结果到了吗？到了立刻吃，没到存外卖柜等通知"' },
      { type: 'info', text: '══ 4. 练习 ══' },
      { type: 'pass', text: '练习1: 用"外卖订单"类比给面试官解释 Promise 三种状态' },
      { type: 'pass', text: '练习2: 盲写 MyPromise 的 constructor + then（10min）' },
      { type: 'pass', text: '练习3: 写出下面的输出顺序：' },
      { type: 'code', text: 'console.log("A")' },
      { type: 'code', text: 'new Promise(resolve => {' },
      { type: 'code', text: '  console.log("B")' },
      { type: 'code', text: '  resolve()' },
      { type: 'code', text: '}).then(() => console.log("C"))' },
      { type: 'code', text: 'console.log("D")' },
      { type: 'pass', text: 'answer: A B D C （B是同步的！C是微任务等同步完才执行）' },
    ]
  },

  deep: {
    title: 'DeepClone Module - Coverage Report',
    content: [
      { type: 'info', text: '══ 1. 场景：浅拷贝的坑 ══' },
      { type: 'code', text: 'const config = { theme: { color: "blue" } }' },
      { type: 'code', text: 'const copy = { ...config }           // 浅拷贝' },
      { type: 'code', text: 'copy.theme.color = "red"' },
      { type: 'code', text: 'console.log(config.theme.color)      // ❌ "red"！原对象也被改了' },
      { type: 'log',  text: '浅拷贝只复制第一层，嵌套对象还是共享引用' },
      { type: 'log',  text: '表单编辑、撤销/重做、Redux 状态管理都需要深拷贝' },
      { type: 'info', text: '── JSON 序列化为什么不行？ ──' },
      { type: 'code', text: 'const obj = { fn: ()=>{}, date: new Date(), self: null }' },
      { type: 'code', text: 'obj.self = obj  // 循环引用' },
      { type: 'code', text: 'JSON.parse(JSON.stringify(obj))  // ❌ 函数丢失、Date变字符串、循环引用报错' },
      { type: 'warn', text: 'JSON 方案五个缺陷: 函数丢失、undefined丢失、Date变字符串、RegExp变空对象、循环引用报错' },
      { type: 'info', text: '══ 2. 原理：递归 + 引用记录 ══' },
      { type: 'log',  text: '深拷贝的思路像"复印一棵树"：' },
      { type: 'log',  text: '  ① 基本类型（叶子）→ 直接返回，不需要拷贝' },
      { type: 'log',  text: '  ② 对象/数组（树枝）→ 创建空容器，递归拷贝每个子节点' },
      { type: 'log',  text: '  ③ 循环引用（树枝指回树根）→ 用WeakMap记录"已拷贝过的"，遇到直接返回' },
      { type: 'warn', text: 'WeakMap 的好处：弱引用不阻止垃圾回收，不会内存泄漏' },
      { type: 'info', text: '══ 3. 实现（面试写到这个版本就够）══' },
      { type: 'code', text: 'function deepClone(obj, map = new WeakMap()) {' },
      { type: 'code', text: '  // ① 基本类型直接返回' },
      { type: 'code', text: '  if (obj === null || typeof obj !== "object") return obj' },
      { type: 'code', text: '  // ② 已拷贝过 → 直接返回（解决循环引用）' },
      { type: 'code', text: '  if (map.has(obj)) return map.get(obj)' },
      { type: 'code', text: '  // ③ 创建空容器，先注册再递归（顺序不能反！）' },
      { type: 'code', text: '  const clone = Array.isArray(obj) ? [] : {}' },
      { type: 'code', text: '  map.set(obj, clone)' },
      { type: 'code', text: '  // ④ 递归拷贝每个属性' },
      { type: 'code', text: '  for (const key in obj) {' },
      { type: 'code', text: '    if (obj.hasOwnProperty(key)) clone[key] = deepClone(obj[key], map)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return clone' },
      { type: 'code', text: '}' },
      { type: 'info', text: '── 你踩过的三个坑（Day 8）──' },
      { type: 'err',  text: 'BUG 1: typeof obj == "object" 少写了 ! → 条件写反了' },
      { type: 'err',  text: 'BUG 2: 递归参数传了 obj 应该传 obj[key]' },
      { type: 'err',  text: 'BUG 3: map.set 放在递归之后 → 循环引用时还是爆栈' },
      { type: 'warn', text: '检查清单: ① !== 不是 == ② 递归参数是子节点 ③ 先注册再递归' },
      { type: 'info', text: '══ 4. 练习 ══' },
      { type: 'pass', text: '练习1: 说出"为什么 JSON 方案不行"的 5 个理由（不看笔记）' },
      { type: 'pass', text: '练习2: 盲写 deepClone（7min），写完后用下面的case验证：' },
      { type: 'code', text: 'const a = { x: 1, arr: [2,3], nested: { y: 4 } }' },
      { type: 'code', text: 'a.self = a  // 循环引用' },
      { type: 'code', text: 'const b = deepClone(a)' },
      { type: 'code', text: 'b.nested.y = 99' },
      { type: 'code', text: 'console.log(a.nested.y)  // 应该还是 4，不是 99' },
      { type: 'code', text: 'console.log(b.self === b) // 应该是 true，不是 a' },
      { type: 'pass', text: '练习3: 面试追问"WeakMap 和 Map 的区别"，用一句话回答' },
      { type: 'log',  text: '答: WeakMap 的 key 是弱引用，key 对象被垃圾回收后自动消失，不会内存泄漏' },
    ]
  },

  debounce: {
    title: 'Debounce & Throttle - Performance Test',
    content: [
      { type: 'info', text: '══ 1. 场景：高频事件的性能问题 ══' },
      { type: 'log',  text: '搜索框每输入一个字就发请求？用户打"javascript"就发了10次请求' },
      { type: 'log',  text: '滚动页面每像素都触发handler？1秒滚动触发上百次函数调用' },
      { type: 'log',  text: '窗口resize每像素都重新计算布局？卡到没法用' },
      { type: 'warn', text: '防抖和节流就是限制高频事件的调用频率' },
      { type: 'info', text: '── 生活类比 ──' },
      { type: 'log',  text: '防抖 = 电梯关门：有人进来就重新等3秒，没人了才关门' },
      { type: 'log',  text: '节流 = 地铁发车：不管来多少人，每3分钟发一班' },
      { type: 'info', text: '══ 2. 原理 ══' },
      { type: 'info', text: '── 防抖 Debounce ──' },
      { type: 'log',  text: '每次触发都重置定时器，停止触发delay毫秒后才真正执行' },
      { type: 'log',  text: '快速输入 a-b-c-d-e，只在 e 之后的delay毫秒后执行一次' },
      { type: 'pass', text: '适用：搜索框输入、窗口resize、按钮防重复点击' },
      { type: 'info', text: '── 节流 Throttle ──' },
      { type: 'log',  text: '固定间隔执行一次，中间的触发全部忽略' },
      { type: 'log',  text: '快速滚动时，每200ms执行一次handler，不多不少' },
      { type: 'pass', text: '适用：滚动加载、mousemove拖拽、射击游戏开火' },
      { type: 'info', text: '── 共同点 ──' },
      { type: 'pass', text: '都是高阶函数：接收函数，返回新函数（闭包保存状态）' },
      { type: 'pass', text: '闭包中的变量(timer/lastTime)在多次调用间保持 → 这就是为什么要return function' },
      { type: 'info', text: '══ 3. 实现 ══' },
      { type: 'info', text: '── 防抖（面试写这个版本）──' },
      { type: 'code', text: 'function debounce(fn, delay) {' },
      { type: 'code', text: '  let timer = null               // 闭包保存定时器' },
      { type: 'code', text: '  return function(...args) {      // 返回新函数' },
      { type: 'code', text: '    clearTimeout(timer)           // 每次触发都清掉上一个' },
      { type: 'code', text: '    timer = setTimeout(() => {    // 重新开始计时' },
      { type: 'code', text: '      fn.apply(this, args)        // delay后执行' },
      { type: 'code', text: '    }, delay)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'log',  text: '使用: input.oninput = debounce(search, 300)' },
      { type: 'info', text: '── 节流（时间戳版，面试首选）──' },
      { type: 'code', text: 'function throttle(fn, delay) {' },
      { type: 'code', text: '  let lastTime = 0               // 闭包保存上次执行时间' },
      { type: 'code', text: '  return function(...args) {' },
      { type: 'code', text: '    const now = Date.now()        // ⚠️ Date.now() 不是 new Date().now()' },
      { type: 'code', text: '    if (now - lastTime >= delay) {// 间隔够了才执行' },
      { type: 'code', text: '      fn.apply(this, args)' },
      { type: 'code', text: '      lastTime = now' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'log',  text: '使用: window.onscroll = throttle(loadMore, 200)' },
      { type: 'info', text: '── 你踩过的坑（Day 8）──' },
      { type: 'err',  text: '防抖: 变量名拼错 time vs delay → 变量命名要一致' },
      { type: 'err',  text: '节流: new Date().now() → 应该是 Date.now()（静态方法）' },
      { type: 'warn', text: '一开始没理解"为什么要return function" → 因为闭包保持timer状态' },
      { type: 'info', text: '══ 4. 练习 ══' },
      { type: 'pass', text: '练习1: 用"电梯关门"和"地铁发车"分别解释防抖和节流' },
      { type: 'pass', text: '练习2: 盲写防抖（3min）+ 盲写节流（3min）' },
      { type: 'pass', text: '练习3: 面试追问"两种节流版本的区别"：' },
      { type: 'log',  text: '  时间戳版: 首次立即执行，最后一次不执行（leading）' },
      { type: 'log',  text: '  定时器版: 首次delay后执行，最后一次也执行（trailing）' },
      { type: 'pass', text: '练习4: 回答"防抖和节流能不能用箭头函数返回？"' },
      { type: 'log',  text: '  答: 内层不能用箭头函数，因为需要正确的 this（事件处理中 this = DOM元素）' },
    ]
  },

  call: {
    title: 'Function.prototype - Method Binding Tests',
    content: [
      { type: 'info', text: '══ 1. 场景：this 丢失问题 ══' },
      { type: 'code', text: 'const user = {' },
      { type: 'code', text: '  name: "小明",' },
      { type: 'code', text: '  greet() { console.log("我是" + this.name) }' },
      { type: 'code', text: '}' },
      { type: 'code', text: 'user.greet()          // ✅ "我是小明" — user 调用，this = user' },
      { type: 'code', text: 'const fn = user.greet' },
      { type: 'code', text: 'fn()                  // ❌ "我是undefined" — 没人调用，this 丢了！' },
      { type: 'log',  text: '把方法赋值给变量、传入回调、setTimeout 都会导致 this 丢失' },
      { type: 'warn', text: 'call/apply/bind 就是解决这个问题的：手动指定 this 指向谁' },
      { type: 'info', text: '── 什么时候用？ ──' },
      { type: 'log',  text: '① 借用别人的方法：Object.prototype.toString.call([]) → 检测类型' },
      { type: 'log',  text: '② 类数组转数组：Array.prototype.slice.call(arguments)' },
      { type: 'log',  text: '③ 回调锁定this：setInterval(this.tick.bind(this), 1000)' },
      { type: 'log',  text: '④ 预填参数：const warn = log.bind(null, "WARN") → warn("msg")' },
      { type: 'log',  text: '⑤ React类组件：this.handleClick = this.handleClick.bind(this)' },
      { type: 'info', text: '══ 2. 原理：this 到底怎么决定？ ══' },
      { type: 'pass', text: '规则1: obj.fn() → this = obj （谁调用，this就是谁）' },
      { type: 'pass', text: '规则2: fn() → this = window/undefined （没人调用，指向全局/严格undefined）' },
      { type: 'pass', text: '规则3: fn.call(ctx) → this = ctx （手动指定）' },
      { type: 'pass', text: '规则4: new Fn() → this = 新创建的实例' },
      { type: 'pass', text: '规则5: () => {} → this = 定义时的外层 this（箭头函数不能改）' },
      { type: 'warn', text: '优先级: new > call/apply/bind > obj.fn() > fn()' },
      { type: 'info', text: '── call 的原理：临时挂方法 ──' },
      { type: 'log',  text: '既然 obj.fn() 能让 this = obj' },
      { type: 'log',  text: '那只要把函数临时挂到 ctx 上当方法调用，this 就 = ctx 了' },
      { type: 'code', text: '// fn.call(ctx, args) 的本质：' },
      { type: 'code', text: 'ctx.__temp__ = fn      // 挂上去' },
      { type: 'code', text: 'ctx.__temp__(args)     // 作为方法调用 → this = ctx' },
      { type: 'code', text: 'delete ctx.__temp__    // 清理，假装没来过' },
      { type: 'info', text: '══ 3. 实现 ══' },
      { type: 'info', text: '── myCall ──' },
      { type: 'code', text: 'Function.prototype.myCall = function(ctx, ...args) {' },
      { type: 'code', text: '  ctx = ctx ?? globalThis                 // null/undefined → 全局' },
      { type: 'code', text: '  if (typeof ctx !== "object" && typeof ctx !== "function")' },
      { type: 'code', text: '    ctx = Object(ctx)                     // 数字/字符串 → 包装对象' },
      { type: 'code', text: '  const key = Symbol()                    // 唯一key，不怕撞' },
      { type: 'code', text: '  ctx[key] = this                         // 挂方法' },
      { type: 'code', text: '  const result = ctx[key](...args)        // 调用' },
      { type: 'code', text: '  delete ctx[key]                         // 清理' },
      { type: 'code', text: '  return result' },
      { type: 'code', text: '}' },
      { type: 'info', text: '── myApply（唯一区别：参数是数组）──' },
      { type: 'code', text: 'Function.prototype.myApply = function(ctx, argsArray) {' },
      { type: 'code', text: '  // ...同 myCall，只是最后一行改为：' },
      { type: 'code', text: '  const result = argsArray ? ctx[key](...argsArray) : ctx[key]()' },
      { type: 'code', text: '}' },
      { type: 'info', text: '── myBind（返回新函数，不立即调用）──' },
      { type: 'code', text: 'Function.prototype.myBind = function(ctx, ...outerArgs) {' },
      { type: 'code', text: '  const originalFn = this           // 必须存！内层this会变' },
      { type: 'code', text: '  return function(...innerArgs) {   // 返回新函数（闭包）' },
      { type: 'code', text: '    return originalFn.call(ctx, ...outerArgs, ...innerArgs)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'bind 和 call 的区别：call 当场执行，bind 存起来以后执行' },
      { type: 'info', text: '── 速记 ──' },
      { type: 'pass', text: 'call:  fn.call(ctx, a, b)     当场执行，参数逐个传' },
      { type: 'pass', text: 'apply: fn.apply(ctx, [a, b])  当场执行，参数数组传' },
      { type: 'pass', text: 'bind:  fn.bind(ctx, a)(b)     返回新函数，支持预填参数' },
      { type: 'info', text: '══ 4. 练习 ══' },
      { type: 'pass', text: '练习1: 不看代码，说出 myCall 的三步（挂方法→调用→清理）' },
      { type: 'pass', text: '练习2: 盲写 myCall（5min），注意 Symbol 和 null 处理' },
      { type: 'pass', text: '练习3: 盲写 myBind（3min），注意存 originalFn' },
      { type: 'pass', text: '练习4: 写出下面的输出：' },
      { type: 'code', text: 'function greet(greeting) { return greeting + this.name }' },
      { type: 'code', text: 'const obj = { name: "Tom" }' },
      { type: 'code', text: 'greet.call(obj, "Hi ")         // → ?' },
      { type: 'code', text: 'greet.apply(obj, ["Hello "])   // → ?' },
      { type: 'code', text: 'greet.bind(obj)("Hey ")        // → ?' },
      { type: 'pass', text: 'answers: "Hi Tom", "Hello Tom", "Hey Tom"' },
    ]
  },

  curry: {
    title: 'Currying & PubSub - Pattern Tests',
    content: [
      { type: 'info', text: '══ 柯里化 Currying ══' },
      { type: 'log',  text: 'spec: 把多参函数变成可以逐个传参的函数链' },
      { type: 'log',  text: 'usage: add(1,2,3) → curry(add)(1)(2)(3) 或 curry(add)(1,2)(3)' },
      { type: 'pass', text: 'pattern: 递归收集参数，够了就执行' },
      { type: 'info', text: '── 实现 ──' },
      { type: 'code', text: 'function curry(fn) {' },
      { type: 'code', text: '  return function curried(...args) {' },
      { type: 'code', text: '    if (args.length >= fn.length) {  // fn.length = 形参个数' },
      { type: 'code', text: '      return fn.apply(this, args)    // 参数够了，执行' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '    return function(...newArgs) {    // 参数不够，继续收集' },
      { type: 'code', text: '      return curried.apply(this, [...args, ...newArgs])' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'fn.length: 函数的形参个数（不含默认值/rest参数），用来判断参数是否收集够' },
      { type: 'info', text: '── real-world ──' },
      { type: 'log',  text: 'const log = curry((level, module, msg) => ...)' },
      { type: 'log',  text: 'const warnDB = log("WARN")("DB")  // 预填前两个参数' },
      { type: 'log',  text: 'warnDB("connection timeout")       // 只传最后一个' },
      { type: 'pass', text: '柯里化的本质是 partial application（偏应用）' },
      { type: 'info', text: '══ 发布订阅 EventEmitter ══' },
      { type: 'log',  text: 'spec: 事件总线，支持 on/off/emit/once 四个方法' },
      { type: 'log',  text: 'usage: Vue $emit/$on, Node EventEmitter, DOM addEventListener' },
      { type: 'pass', text: 'vs 观察者模式: 发布订阅有中间人(事件中心)，观察者是直接通知' },
      { type: 'info', text: '── 实现 ──' },
      { type: 'code', text: 'class EventEmitter {' },
      { type: 'code', text: '  constructor() { this.events = {} }' },
      { type: 'code', text: '  on(event, fn) {' },
      { type: 'code', text: '    if (!this.events[event]) this.events[event] = []' },
      { type: 'code', text: '    this.events[event].push(fn)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  off(event, fn) {' },
      { type: 'code', text: '    if (!this.events[event]) return' },
      { type: 'code', text: '    this.events[event] = this.events[event].filter(f => f !== fn)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  emit(event, ...args) {' },
      { type: 'code', text: '    if (!this.events[event]) return' },
      { type: 'code', text: '    this.events[event].forEach(fn => fn(...args))' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  once(event, fn) {' },
      { type: 'code', text: '    const wrapper = (...args) => { fn(...args); this.off(event, wrapper) }' },
      { type: 'code', text: '    this.on(event, wrapper)  // 注册 wrapper 不是 fn！' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'TRAP: once 的 off 要传 wrapper 不是 fn，因为 on 注册的是 wrapper' },
      { type: 'info', text: '── 面试追问 ──' },
      { type: 'log',  text: 'Q: off 为什么用 filter 不用 splice?' },
      { type: 'log',  text: 'A: filter 返回新数组，不影响正在遍历的原数组（emit 中 forEach）' },
      { type: 'log',  text: 'Q: 和 DOM addEventListener 的区别?' },
      { type: 'log',  text: 'A: addEventListener 是浏览器 API，EventEmitter 是纯 JS 实现' },
    ]
  },

  pall: {
    title: 'Promise.all & instanceof - Utility Tests',
    content: [
      { type: 'info', text: '══ Promise.all ══' },
      { type: 'log',  text: 'spec: 全部 resolve → resolve(结果数组) | 任一 reject → reject' },
      { type: 'log',  text: 'usage: Promise.all([fetchA(), fetchB()]).then(([a, b]) => ...)' },
      { type: 'info', text: '── 实现 ──' },
      { type: 'code', text: 'function promiseAll(promises) {' },
      { type: 'code', text: '  return new Promise((resolve, reject) => {' },
      { type: 'code', text: '    const results = []' },
      { type: 'code', text: '    let count = 0' },
      { type: 'code', text: '    promises.forEach((p, i) => {' },
      { type: 'code', text: '      Promise.resolve(p).then(val => {' },
      { type: 'code', text: '        results[i] = val                    // 用 i 保证顺序！' },
      { type: 'code', text: '        count++' },
      { type: 'code', text: '        if (count === promises.length) resolve(results)' },
      { type: 'code', text: '      }).catch(reject)' },
      { type: 'code', text: '    })' },
      { type: 'code', text: '  })' },
      { type: 'code', text: '}' },
      { type: 'info', text: '── 三个坑点 ──' },
      { type: 'warn', text: 'TRAP 1: results[i] 不是 push — 异步完成顺序不确定，用索引保证顺序' },
      { type: 'warn', text: 'TRAP 2: count++ 不是 results.length — 稀疏赋值时 length 会骗你' },
      { type: 'warn', text: 'TRAP 3: Promise.resolve(p) 包一层 — 输入可能是普通值不是 Promise' },
      { type: 'info', text: '── 兄弟 API 对比 ──' },
      { type: 'log',  text: 'Promise.all:        全部成功才成功，一个失败就失败' },
      { type: 'log',  text: 'Promise.allSettled:  全部结束（不管成功失败），返回状态数组' },
      { type: 'log',  text: 'Promise.race:        第一个完成的结果（成功或失败）' },
      { type: 'log',  text: 'Promise.any:         第一个成功的结果，全失败才失败' },
      { type: 'info', text: '══ instanceof ══' },
      { type: 'log',  text: 'spec: a instanceof B → a 的原型链上能不能找到 B.prototype' },
      { type: 'info', text: '── 实现 ──' },
      { type: 'code', text: 'function myInstanceof(obj, constructor) {' },
      { type: 'code', text: '  if (obj === null || typeof obj !== "object") return false' },
      { type: 'code', text: '  let proto = Object.getPrototypeOf(obj)' },
      { type: 'code', text: '  while (proto !== null) {' },
      { type: 'code', text: '    if (proto === constructor.prototype) return true' },
      { type: 'code', text: '    proto = Object.getPrototypeOf(proto)  // 沿原型链往上找' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return false' },
      { type: 'code', text: '}' },
      { type: 'pass', text: 'Object.getPrototypeOf 是标准方法, __proto__ 非标准但浏览器都支持' },
      { type: 'info', text: '── 原型链速记 ──' },
      { type: 'log',  text: 'obj → Object.getPrototypeOf(obj) → ... → Object.prototype → null' },
      { type: 'log',  text: '[] → Array.prototype → Object.prototype → null' },
      { type: 'log',  text: '所以 [] instanceof Array === true, [] instanceof Object === true' },
    ]
  },

  algo: {
    title: 'Algorithm Pattern - Regression Suite',
    content: [
      { type: 'info', text: '── hash table pattern ──' },
      { type: 'pass', text: '#1   twoSum:     Map {val→idx}, check target-nums[i]    O(n)' },
      { type: 'pass', text: '#49  groupAnag:  sort as key, Map {key→[words]}          O(n*klogk)' },
      { type: 'pass', text: '#128 longestSeq: Set, find start (num-1 not in set)      O(n)' },
      { type: 'info', text: '── two pointer pattern ──' },
      { type: 'warn', text: '#283 moveZeroes: fast-slow, swap non-zero to slow pos    O(n)' },
      { type: 'log',  text: '  └─ TRAP: use for loop not while, avoid off-by-one' },
      { type: 'warn', text: '#11  maxArea:    L/R collision, move shorter side         O(n)' },
      { type: 'log',  text: '  └─ TRAP: left++ not left--, while(left < right)' },
      { type: 'info', text: '── sliding window pattern ──' },
      { type: 'warn', text: '#3   lengthOfLS: Set + while(has) shrink left             O(n)' },
      { type: 'log',  text: '  └─ TRAP: while < not <=, string can index directly' },
      { type: 'pass', text: '#438 findAnag:   fixed window + count[26] compare         O(n)' },
      { type: 'info', text: '── linked list pattern ──' },
      { type: 'pass', text: '#206 reverse:     prev/curr/next 3-pointer iterate     O(n)' },
      { type: 'pass', text: '#21  merge:       dummy head + compare & append        O(n+m)' },
      { type: 'pass', text: '#141 hasCycle:    fast-slow, meet = cycle              O(n)' },
      { type: 'warn', text: '#142 cycleEntry:  meet → ptr from head, same speed     O(n)' },
      { type: 'pass', text: '#19  removeNth:   dummy + fast leads by n+1            O(n)' },
      { type: 'pass', text: '#160 intersect:   cross-traverse A→B, B→A              O(n+m)' },
      { type: 'info', text: '── stack pattern ──' },
      { type: 'pass', text: '#20  validParen:  stack + map, check empty at end      O(n)' },
      { type: 'pass', text: '#155 minStack:    aux stack synced for O(1) getMin     O(1)' },
      { type: 'info', text: '── template ──' },
      { type: 'log',  text: 'hash:    Map/Set for O(1) lookup, space trades time' },
      { type: 'log',  text: 'pointer: for(fast) + slow tracks position, check boundary!' },
      { type: 'log',  text: 'window:  right expand, condition fail → left shrink, update answer' },
      { type: 'log',  text: 'linked:  dummy node / fast-slow / draw on paper!' },
      { type: 'log',  text: 'stack:   LIFO, matching/nesting/backtrack problems' },
    ]
  },

  linked: {
    title: 'Linked List - Pattern Summary',
    content: [
      { type: 'info', text: '── 链表核心技巧 ──' },
      { type: 'pass', text: 'dummy node: 虚拟头节点，避免处理头节点特殊情况' },
      { type: 'pass', text: 'fast-slow pointer: 快慢指针，环检测/找中点/倒数第N' },
      { type: 'pass', text: 'draw on paper: 链表题必须画图，不要在脑子里想' },
      { type: 'info', text: '── 题目总结 ──' },
      { type: 'pass', text: '#206 反转:    prev/curr/next 三指针迭代          O(n)/O(1)' },
      { type: 'pass', text: '#21  合并:    dummy + 逐个比较 + 接剩余          O(n+m)/O(1)' },
      { type: 'pass', text: '#141 环检测:  fast走2步slow走1步，相遇=有环      O(n)/O(1)' },
      { type: 'warn', text: '#142 环入口:  相遇后一个回head同速走，再遇=入口  O(n)/O(1)' },
      { type: 'log',  text: '  └─ math: a = (n-1)c + (c-b)，面试追问高频' },
      { type: 'pass', text: '#19  删倒N:   dummy + fast先走n+1步              O(n)/O(1)' },
      { type: 'log',  text: '  └─ TRAP: n+1步不是n步，slow要停在目标前一个' },
      { type: 'pass', text: '#160 相交:    A走完走B，B走完走A → 交点相遇     O(n+m)/O(1)' },
      { type: 'log',  text: '  └─ 无交点时两指针同时到null，也能正确返回' },
      { type: 'info', text: '── while 条件速查 ──' },
      { type: 'log',  text: '#206: while (curr)              curr不为null就继续' },
      { type: 'log',  text: '#21:  while (l1 && l2)          两个都有才比较' },
      { type: 'log',  text: '#141: while (fast && fast.next)  fast走2步都要检查' },
      { type: 'log',  text: '#19:  while (fast)              fast到null时slow在目标前' },
      { type: 'log',  text: '#160: while (pA !== pB)         相遇就停' },
    ]
  },

  stack: {
    title: 'Stack - Pattern Summary',
    content: [
      { type: 'info', text: '── 栈的特性 ──' },
      { type: 'pass', text: 'LIFO: Last In First Out，后进先出' },
      { type: 'pass', text: 'JS用数组模拟: push(入栈), pop(出栈), at(-1)(看栈顶)' },
      { type: 'info', text: '── 经典应用场景 ──' },
      { type: 'log',  text: '1. 括号匹配 (#20)' },
      { type: 'log',  text: '2. 辅助栈设计 (#155 最小栈)' },
      { type: 'log',  text: '3. 单调栈 (#739 每日温度, #84 柱状图最大矩形)' },
      { type: 'log',  text: '4. 字符串解码 (#394)' },
      { type: 'log',  text: '5. 表达式求值 (逆波兰)' },
      { type: 'info', text: '── 题目总结 ──' },
      { type: 'pass', text: '#20  括号匹配: 左括号push，右括号pop比较         O(n)/O(n)' },
      { type: 'warn', text: '  └─ TRAP: 最后检查 stack.length === 0' },
      { type: 'pass', text: '#155 最小栈:  辅助栈同步记录每个状态的最小值     O(1) all ops' },
      { type: 'warn', text: '  └─ key: 辅助栈与主栈同步push/pop' },
      { type: 'info', text: '── 模板 ──' },
      { type: 'log',  text: 'stack: 后进先出，匹配/嵌套/回溯问题首选' },
      { type: 'log',  text: 'monotonic stack: 找"下一个更大/更小"元素' },
    ]
  },

  weak: {
    title: 'Known Issues - Bug Tracker',
    content: [
      { type: 'info', text: '── 高频错误模式（按严重程度排序）──' },
      { type: 'err',  text: 'ISSUE-001: 边界 off-by-one (出现 3 次 / 7 天)' },
      { type: 'log',  text: '  #283: s2++ 放在 if 前 → 跳过 index 0 且可能越界' },
      { type: 'log',  text: '  #11:  left++ 写成 left-- (困了脑子不清晰)' },
      { type: 'log',  text: '  #3:   while <= 应为 <' },
      { type: 'warn', text: 'FIX: 双指针必须用 for 循环，写完后检查三项：< vs <=, ++ vs --, 初始值' },
      { type: 'pass', text: 'PREVENTION: 写完代码用最简单的 case 手动跑一遍（如 [0,1] 或 [1,2]）' },
      { type: 'info', text: '' },
      { type: 'err',  text: 'ISSUE-002: Promise then() 执行时机 (Day 3)' },
      { type: 'log',  text: '  fulfilled 状态 → 应直接执行回调，不要 push 到数组' },
      { type: 'log',  text: '  pending 状态 → push 箭头函数 () => onFulfilled(value)' },
      { type: 'log',  text: '  错误写法: push(onFulfilled()) ← () 导致立即调用!' },
      { type: 'warn', text: 'FIX: 问自己"结果准备好了吗？" yes → 立即执行 | no → 存箭头函数等通知' },
      { type: 'info', text: '' },
      { type: 'err',  text: 'ISSUE-003: 数据结构选错 (出现 2 次)' },
      { type: 'log',  text: '  #438: 用 Set（去重）应该用 count[26]（计数）' },
      { type: 'log',  text: '  #3:   用数组 includes（O(n)）应该用 Set.has（O(1)）' },
      { type: 'warn', text: 'FIX: 先读题两遍，问"我需要去重？计数？查找？"再选数据结构' },
      { type: 'info', text: '' },
      { type: 'err',  text: 'ISSUE-004: 闭包 + return function 理解不足 (Day 8)' },
      { type: 'log',  text: '  防抖/节流/柯里化/bind 都是高阶函数 → 返回闭包' },
      { type: 'log',  text: '  之前没意识到"为什么要 return function"的必要性' },
      { type: 'warn', text: 'FIX: 高阶函数 = 接收/返回函数。闭包 = 内层函数引用外层变量' },
      { type: 'pass', text: '看到 timer/fn/context 要在多次调用间保持 → 一定需要闭包' },
      { type: 'info', text: '' },
      { type: 'err',  text: 'ISSUE-005: 深拷贝递归边界 (Day 8)' },
      { type: 'log',  text: '  typeof obj == "object" 写反了（应该是 !==）' },
      { type: 'log',  text: '  递归参数传了 obj 应该传 obj[key]' },
      { type: 'log',  text: '  Date/RegExp 检查位置放在了 WeakMap 之后' },
      { type: 'warn', text: 'FIX: 递归函数写完后，必须检查：边界条件 → 递归参数 → 特殊分支顺序' },
      { type: 'info', text: '' },
      { type: 'info', text: '── 整体反思 ──' },
      { type: 'pass', text: '框架思路基本正确，问题集中在细节和粗心' },
      { type: 'pass', text: '每次出错后能自己定位问题，说明理解力没问题' },
      { type: 'warn', text: '但面试不给第二次机会 — 写完必须手动验证一遍' },
    ]
  },
}

// ─── Renderer ───
const C = {
  reset: '\x1b[0m',
  dim:   '\x1b[2m',
  green: '\x1b[32m',
  yellow:'\x1b[33m',
  red:   '\x1b[31m',
  cyan:  '\x1b[36m',
  gray:  '\x1b[90m',
  white: '\x1b[37m',
  bold:  '\x1b[1m',
}

function render(topic) {
  const data = topics[topic]
  if (!data) {
    console.log(`${C.red}Error: unknown module '${topic}'${C.reset}`)
    listTopics()
    return
  }

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
  console.log()
  console.log(`${C.dim}[${now}]${C.reset} ${C.bold}${C.white}${data.title}${C.reset}`)
  console.log(`${C.dim}${'─'.repeat(60)}${C.reset}`)

  let pass = 0, warn = 0, fail = 0

  data.content.forEach(item => {
    const ts = C.dim + '[' + new Date().toISOString().slice(11, 23) + ']' + C.reset
    switch (item.type) {
      case 'pass':
        pass++
        console.log(`  ${C.green}✓${C.reset} ${C.green}${item.text}${C.reset}`)
        break
      case 'warn':
        warn++
        console.log(`  ${C.yellow}⚠${C.reset} ${C.yellow}${item.text}${C.reset}`)
        break
      case 'err':
        fail++
        console.log(`  ${C.red}✗${C.reset} ${C.red}${item.text}${C.reset}`)
        break
      case 'info':
        console.log(`  ${C.cyan}${item.text}${C.reset}`)
        break
      case 'code':
        console.log(`  ${C.gray}│${C.reset} ${C.white}${item.text}${C.reset}`)
        break
      case 'log':
      default:
        console.log(`  ${C.dim}${item.text}${C.reset}`)
    }
  })

  console.log(`${C.dim}${'─'.repeat(60)}${C.reset}`)
  const parts = []
  if (pass) parts.push(`${C.green}${pass} passed${C.reset}`)
  if (warn) parts.push(`${C.yellow}${warn} warnings${C.reset}`)
  if (fail) parts.push(`${C.red}${fail} issues${C.reset}`)
  console.log(`  ${parts.join(C.dim + ' | ' + C.reset)}`)
  console.log()
}

function listTopics() {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
  console.log()
  console.log(`${C.dim}[${now}]${C.reset} ${C.bold}Available Test Suites${C.reset}`)
  console.log(`${C.dim}${'─'.repeat(60)}${C.reset}`)
  console.log(`  ${C.cyan}event${C.reset}     Event Loop module tests`)
  console.log(`  ${C.cyan}promise${C.reset}   Promise implementation verification`)
  console.log(`  ${C.cyan}deep${C.reset}      DeepClone coverage report`)
  console.log(`  ${C.cyan}debounce${C.reset}  Debounce & Throttle perf tests`)
  console.log(`  ${C.cyan}call${C.reset}      Function.prototype binding tests`)
  console.log(`  ${C.cyan}linked${C.reset}    Linked list pattern summary`)
  console.log(`  ${C.cyan}stack${C.reset}     Stack pattern summary`)
  console.log(`  ${C.cyan}algo${C.reset}      Algorithm pattern regression suite`)
  console.log(`  ${C.cyan}weak${C.reset}      Known issues & bug tracker`)
  console.log(`${C.dim}${'─'.repeat(60)}${C.reset}`)
  console.log(`  ${C.dim}Usage: node review.js <suite>${C.reset}`)
  console.log(`  ${C.dim}Alias: echo 'alias rr="node ~/preview/review.js"' >> ~/.zshrc${C.reset}`)
  console.log()
}

function showHelp() {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
  console.log()
  console.log(`${C.bold}  Review Runner v1.0${C.reset} ${C.dim}(disguised as test runner)${C.reset}`)
  console.log()
  console.log(`${C.white}  Usage:${C.reset}  rr ${C.cyan}<suite>${C.reset} [options]`)
  console.log()
  console.log(`${C.white}  Suites:${C.reset}`)
  console.log(`    ${C.cyan}event${C.reset}      事件循环            ${C.dim}rr e${C.reset}`)
  console.log(`    ${C.cyan}promise${C.reset}    实现 Promise        ${C.dim}rr p${C.reset}`)
  console.log(`    ${C.cyan}deep${C.reset}       实现深拷贝          ${C.dim}rr d${C.reset}`)
  console.log(`    ${C.cyan}debounce${C.reset}   防抖 / 节流         ${C.dim}rr de${C.reset}`)
  console.log(`    ${C.cyan}call${C.reset}       call / bind / apply ${C.dim}rr c${C.reset}`)
  console.log(`    ${C.cyan}curry${C.reset}      柯里化 + 发布订阅   ${C.dim}rr cu${C.reset}`)
  console.log(`    ${C.cyan}pall${C.reset}       Promise.all + instanceof ${C.dim}rr pa${C.reset}`)
  console.log(`    ${C.cyan}linked${C.reset}     链表套路总结        ${C.dim}rr l${C.reset}`)
  console.log(`    ${C.cyan}stack${C.reset}      栈套路总结          ${C.dim}rr s${C.reset}`)
  console.log(`    ${C.cyan}algo${C.reset}       算法套路总结        ${C.dim}rr a${C.reset}`)
  console.log(`    ${C.cyan}weak${C.reset}       薄弱点 & 踩坑记录  ${C.dim}rr w${C.reset}`)
  console.log()
  console.log(`${C.white}  Daily:${C.reset}`)
  console.log(`    ${C.cyan}MMDD${C.reset}       查看某天的任务      ${C.dim}rr 0328${C.reset}`)
  console.log()
  console.log(`${C.white}  Options:${C.reset}`)
  console.log(`    ${C.cyan}all${C.reset}        全部 suite 过一遍   ${C.dim}rr all${C.reset}`)
  console.log(`    ${C.cyan}-h${C.reset}         显示帮助            ${C.dim}rr -h${C.reset}`)
  console.log()
  console.log(`${C.dim}  支持前缀匹配：rr e = rr event, rr p = rr promise${C.reset}`)
  console.log(`${C.dim}  日期格式：MMDD，如 rr 0320 = 3月20日的任务${C.reset}`)
  console.log()
  console.log(`${C.white}  Homework:${C.reset}`)
  console.log(`    ${C.cyan}hw MMDD${C.reset}    打开作业文件        ${C.dim}rr hw 0327${C.reset}`)
  console.log()
}

// ─── Daily Plan ───
const daily = {
  '0320': {
    day: 'Day 1',
    tasks: ['EVT-LOOP runtime quiz', 'TASK-1 twoSum'],
    suites: ['event', 'algo'],
    detail: [
      { type: 'info', text: '── EVT-LOOP  事件循环心算 5 题  [P1 / foundation] ──' },
      { type: 'log',  text: 'spec: 不运行代码，直接推理 console.log 输出顺序' },
      { type: 'pass', text: 'core model: sync → drain ALL microtasks → ONE macrotask → repeat' },
      { type: 'code', text: 'console.log(1)' },
      { type: 'code', text: 'setTimeout(() => console.log(2), 0)' },
      { type: 'code', text: 'Promise.resolve().then(() => console.log(3))' },
      { type: 'code', text: 'console.log(4)' },
      { type: 'pass', text: 'answer: 1 4 3 2' },
      { type: 'log',  text: '1,4 同步 → 3 微任务(Promise.then) → 2 宏任务(setTimeout)' },
      { type: 'warn', text: '对了2题(2,5)，说明基础模型掌握，但嵌套场景需加强' },
      { type: 'info', text: '── TASK-1  twoSum  [P0 / easy] ──' },
      { type: 'log',  text: 'spec: 给定数组和目标值，找两个数的下标使它们之和等于目标值' },
      { type: 'log',  text: 'fixture: nums=[2,7,11,15], target=9' },
      { type: 'log',  text: 'expect:  [0,1]' },
      { type: 'pass', text: 'pattern: Map {val → index}，遍历时查 target-nums[i]' },
      { type: 'code', text: 'function twoSum(nums, target) {' },
      { type: 'code', text: '  const map = new Map()' },
      { type: 'code', text: '  for (let i = 0; i < nums.length; i++) {' },
      { type: 'code', text: '    const complement = target - nums[i]' },
      { type: 'code', text: '    if (map.has(complement)) return [map.get(complement), i]' },
      { type: 'code', text: '    map.set(nums[i], i)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'key: 先查再存，避免用自己匹配自己' },
      { type: 'pass', text: 'O(n) time, O(n) space — Map 空间换时间的经典' },
    ]
  },
  '0321': {
    day: 'Day 2',
    tasks: ['EVT-LOOP retry case 3,4', 'TASK-49 groupAnagrams'],
    suites: ['event', 'algo'],
    detail: [
      { type: 'info', text: '── EVT-LOOP  复习第3、4题  [P1 / review] ──' },
      { type: 'log',  text: 'focus: 嵌套 Promise + async/await 的执行顺序' },
      { type: 'pass', text: 'new Promise(executor) 中 executor 是同步执行的' },
      { type: 'pass', text: 'await x 等价于 x.then(callback)，callback 是微任务' },
      { type: 'warn', text: '嵌套微任务在当前轮次执行，不等下一轮宏任务' },
      { type: 'info', text: '── TASK-49  groupAnagrams  [P1 / medium] ──' },
      { type: 'log',  text: 'spec: 给定字符串数组，将字母异位词组合在一起' },
      { type: 'log',  text: 'fixture: ["eat","tea","tan","ate","nat","bat"]' },
      { type: 'log',  text: 'expect:  [["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { type: 'pass', text: 'pattern: sort each word as key → Map {sortedKey → [words]}' },
      { type: 'code', text: 'function groupAnagrams(strs) {' },
      { type: 'code', text: '  const map = new Map()' },
      { type: 'code', text: '  for (const s of strs) {' },
      { type: 'code', text: '    const key = s.split("").sort().join("")' },
      { type: 'code', text: '    if (!map.has(key)) map.set(key, [])' },
      { type: 'code', text: '    map.get(key).push(s)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return [...map.values()]' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'key insight: 异位词排序后相同 → 用排序结果做 Map 的 key' },
      { type: 'pass', text: 'O(n·k·logk) time (k=单词长度), O(n) space' },
    ]
  },
  '0322': {
    day: 'Day 3',
    tasks: ['PROMISE-IMPL phase 1-2', 'TASK-128 longestSeq', 'PROMISE-IMPL full build'],
    suites: ['promise', 'algo'],
    detail: [
      { type: 'info', text: '── PROMISE-IMPL  手写 Promise 全流程  [P0 / core] ──' },
      { type: 'log',  text: 'Step 1: 骨架 — constructor + state + resolve/reject' },
      { type: 'log',  text: 'Step 2: then 同步版 — 直接判断 state 执行回调' },
      { type: 'err',  text: 'PROBLEM: 异步 executor 时 then 执行时 state 还是 pending' },
      { type: 'log',  text: 'Step 3: 支持异步 — pending 时存回调数组，resolve 时遍历执行' },
      { type: 'warn', text: 'TRAP 1: push onFulfilled() ← () 导致立即调用!' },
      { type: 'log',  text: '  正确: push(() => onFulfilled(this.value))  箭头函数包裹' },
      { type: 'warn', text: 'TRAP 2: fulfilled 时别 push 到数组，要直接执行' },
      { type: 'pass', text: '两个坑点是 Day 3 的核心收获' },
      { type: 'info', text: '── TASK-128  longestConsecutive  [P1 / medium] ──' },
      { type: 'log',  text: 'spec: 找最长连续序列的长度（不要求排序）' },
      { type: 'log',  text: 'fixture: [100,4,200,1,3,2]' },
      { type: 'log',  text: 'expect:  4  (序列 1,2,3,4)' },
      { type: 'pass', text: 'pattern: Set + 找起点(num-1 不在 set 中)' },
      { type: 'code', text: 'function longestConsecutive(nums) {' },
      { type: 'code', text: '  const set = new Set(nums)' },
      { type: 'code', text: '  let maxLen = 0' },
      { type: 'code', text: '  for (const num of set) {' },
      { type: 'code', text: '    if (!set.has(num - 1)) {       // 是序列起点' },
      { type: 'code', text: '      let curr = num, len = 1' },
      { type: 'code', text: '      while (set.has(curr + 1)) { curr++; len++ }' },
      { type: 'code', text: '      maxLen = Math.max(maxLen, len)' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return maxLen' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'key: !set.has(num-1) 确保只从起点开始计数，避免重复' },
      { type: 'pass', text: 'O(n) time, O(n) space' },
    ]
  },
  '0323': {
    day: 'Day 4',
    tasks: ['PROMISE-IMPL retro', 'TASK-283 moveZeroes'],
    suites: ['promise', 'algo', 'weak'],
    detail: [
      { type: 'info', text: '── PROMISE-IMPL  复习两个坑点  [P0 / review] ──' },
      { type: 'pass', text: 'fulfilled 状态 → 直接执行回调，不 push 到数组' },
      { type: 'pass', text: 'pending 状态 → push 箭头函数 () => onFulfilled(this.value)' },
      { type: 'log',  text: 'mental model: "结果准备好了吗？" → yes: 立刻执行 | no: 存起来等' },
      { type: 'info', text: '── TASK-283  moveZeroes  [P1 / easy] ──' },
      { type: 'log',  text: 'spec: 把所有 0 移到数组末尾，保持非零元素相对顺序' },
      { type: 'log',  text: 'fixture: [0,1,0,3,12]' },
      { type: 'log',  text: 'expect:  [1,3,12,0,0]' },
      { type: 'pass', text: 'pattern: fast-slow pointer, swap non-zero to slow pos' },
      { type: 'code', text: 'function moveZeroes(nums) {' },
      { type: 'code', text: '  let slow = 0' },
      { type: 'code', text: '  for (let fast = 0; fast < nums.length; fast++) {' },
      { type: 'code', text: '    if (nums[fast] !== 0) {' },
      { type: 'code', text: '      [nums[slow], nums[fast]] = [nums[fast], nums[slow]]' },
      { type: 'code', text: '      slow++' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'err',  text: 'BUG: 最初用 while + s2++ 放在 if 前，导致跳过 index 0 且可能越界' },
      { type: 'warn', text: 'LESSON: 双指针用 for 循环不用 while，更不容易出边界错误' },
      { type: 'pass', text: 'O(n) time, O(1) space — in-place' },
    ]
  },
  '0324': {
    day: 'Day 5',
    tasks: ['TASK-283 retry for-loop', 'TASK-11 maxArea'],
    suites: ['algo', 'weak'],
    detail: [
      { type: 'info', text: '── TASK-283  复习 for 循环版  [review] ──' },
      { type: 'pass', text: 'for(fast) + slow 追踪位置，非零就交换，清晰不出错' },
      { type: 'info', text: '── TASK-11  maxArea (盛水容器)  [P1 / medium] ──' },
      { type: 'log',  text: 'spec: 找两条线段，使它们与 x 轴构成的容器能容纳最多水' },
      { type: 'log',  text: 'fixture: [1,8,6,2,5,4,8,3,7]' },
      { type: 'log',  text: 'expect:  49' },
      { type: 'pass', text: 'pattern: L/R collision pointer, move shorter side' },
      { type: 'code', text: 'function maxArea(height) {' },
      { type: 'code', text: '  let left = 0, right = height.length - 1' },
      { type: 'code', text: '  let max = 0' },
      { type: 'code', text: '  while (left < right) {' },
      { type: 'code', text: '    const area = Math.min(height[left], height[right]) * (right - left)' },
      { type: 'code', text: '    max = Math.max(max, area)' },
      { type: 'code', text: '    if (height[left] < height[right]) left++' },
      { type: 'code', text: '    else right--' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return max' },
      { type: 'code', text: '}' },
      { type: 'err',  text: 'BUG 1: while 条件错（用了 <= 应为 <）' },
      { type: 'err',  text: 'BUG 2: left++ 写成了 left--（困了脑子不清晰）' },
      { type: 'warn', text: 'why move shorter? 移动较高的那根不可能找到更大面积' },
      { type: 'pass', text: 'O(n) time, O(1) space' },
    ]
  },
  '0325': {
    day: 'Day 6',
    tasks: ['TASK-11 retro', 'TASK-3 longestSubstring'],
    suites: ['algo'],
    detail: [
      { type: 'info', text: '── TASK-11  复习盛水容器  [review] ──' },
      { type: 'pass', text: 'L/R 相向双指针，移动矮的那根，while(left < right)' },
      { type: 'info', text: '── TASK-3  longestSubstring (无重复字符最长子串)  [P1 / medium] ──' },
      { type: 'log',  text: 'spec: 找出不含重复字符的最长子串长度' },
      { type: 'log',  text: 'fixture: "abcabcbb"' },
      { type: 'log',  text: 'expect:  3  ("abc")' },
      { type: 'pass', text: 'pattern: sliding window + Set' },
      { type: 'code', text: 'function lengthOfLongestSubstring(s) {' },
      { type: 'code', text: '  const set = new Set()' },
      { type: 'code', text: '  let left = 0, maxLen = 0' },
      { type: 'code', text: '  for (let right = 0; right < s.length; right++) {' },
      { type: 'code', text: '    while (set.has(s[right])) {' },
      { type: 'code', text: '      set.delete(s[left])' },
      { type: 'code', text: '      left++' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '    set.add(s[right])' },
      { type: 'code', text: '    maxLen = Math.max(maxLen, right - left + 1)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return maxLen' },
      { type: 'code', text: '}' },
      { type: 'err',  text: 'BUG 1: 用数组 includes 代替 Set（忘了字符串可直接下标）' },
      { type: 'err',  text: 'BUG 2: while <= 应为 <' },
      { type: 'warn', text: 'sliding window 模板: right 扩张，条件不满足 → left 收缩' },
      { type: 'pass', text: 'O(n) time, O(min(n,m)) space (m=字符集大小)' },
    ]
  },
  '0326': {
    day: 'Day 7',
    tasks: ['TASK-3 retro window template', 'TASK-438 findAnagrams'],
    suites: ['algo'],
    detail: [
      { type: 'info', text: '── TASK-3  复习滑动窗口模板  [review] ──' },
      { type: 'pass', text: 'for(right 扩张) + while(条件不满足 → left 收缩) + 更新答案' },
      { type: 'info', text: '── TASK-438  findAnagrams (找到所有字母异位词)  [P2 / medium] ──' },
      { type: 'log',  text: 'spec: 找到 s 中所有 p 的异位词的起始索引' },
      { type: 'log',  text: 'fixture: s="cbaebabacd", p="abc"' },
      { type: 'log',  text: 'expect:  [0,6]' },
      { type: 'pass', text: 'pattern: fixed-size window + count[26] compare' },
      { type: 'code', text: 'function findAnagrams(s, p) {' },
      { type: 'code', text: '  if (s.length < p.length) return []' },
      { type: 'code', text: '  const result = []' },
      { type: 'code', text: '  const pCount = new Array(26).fill(0)' },
      { type: 'code', text: '  const sCount = new Array(26).fill(0)' },
      { type: 'code', text: '  const a = "a".charCodeAt(0)' },
      { type: 'code', text: '  for (const c of p) pCount[c.charCodeAt(0) - a]++' },
      { type: 'code', text: '  for (let i = 0; i < s.length; i++) {' },
      { type: 'code', text: '    sCount[s.charCodeAt(i) - a]++' },
      { type: 'code', text: '    if (i >= p.length) sCount[s.charCodeAt(i - p.length) - a]--' },
      { type: 'code', text: '    if (sCount.toString() === pCount.toString()) result.push(i - p.length + 1)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return result' },
      { type: 'code', text: '}' },
      { type: 'err',  text: 'MISTAKE: 一开始用 Set 方向错了，异位词需要计数不是去重' },
      { type: 'warn', text: 'key: 固定窗口大小 = p.length，滑动时左边减右边加' },
      { type: 'pass', text: 'O(n) time, O(1) space (26个字母固定大小)' },
    ]
  },
  '0327': {
    day: 'Day 8',
    tasks: ['UTIL-DC deepClone WeakMap', 'UTIL-DT debounce + throttle'],
    suites: ['deep', 'debounce'],
    detail: [
      { type: 'info', text: '── UTIL-DC  deepClone (WeakMap edition)  [P1 / utility] ──' },
      { type: 'log',  text: 'spec: full clone of nested objects with circular ref support' },
      { type: 'log',  text: 'usage: const c = deepClone(obj); c.b.x = 1; obj.b.x !== 1' },
      { type: 'pass', text: 'pattern: recursive descent + WeakMap memoization' },
      { type: 'code', text: 'function deepClone(obj, map = new WeakMap()) {' },
      { type: 'code', text: '  if (obj === null || typeof obj !== "object") return obj' },
      { type: 'code', text: '  if (map.has(obj)) return map.get(obj)   // circular guard' },
      { type: 'code', text: '  const clone = Array.isArray(obj) ? [] : {}' },
      { type: 'code', text: '  map.set(obj, clone)                     // register BEFORE recurse' },
      { type: 'code', text: '  for (const key in obj) {' },
      { type: 'code', text: '    if (obj.hasOwnProperty(key)) clone[key] = deepClone(obj[key], map)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return clone' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'edge case: typeof null === "object", must check explicitly' },
      { type: 'warn', text: 'edge case: register clone in map BEFORE recursion or infinite loop' },
      { type: 'log',  text: 'extension: handle Date / RegExp / Symbol via Reflect.ownKeys' },
      { type: 'info', text: '── UTIL-DT  debounce  [P1 / utility] ──' },
      { type: 'log',  text: 'spec: defer fn execution until `delay` ms after last call' },
      { type: 'log',  text: 'usage: search input, window resize listener' },
      { type: 'pass', text: 'pattern: closure + clearTimeout/setTimeout reset' },
      { type: 'code', text: 'function debounce(fn, delay) {' },
      { type: 'code', text: '  let timer = null' },
      { type: 'code', text: '  return function (...args) {' },
      { type: 'code', text: '    clearTimeout(timer)' },
      { type: 'code', text: '    timer = setTimeout(() => fn.apply(this, args), delay)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'info', text: '── UTIL-DT  throttle (timestamp variant)  [P1 / utility] ──' },
      { type: 'log',  text: 'spec: invoke fn at most once per `delay` ms window' },
      { type: 'log',  text: 'usage: scroll handler, mousemove' },
      { type: 'code', text: 'function throttle(fn, delay) {' },
      { type: 'code', text: '  let lastTime = 0' },
      { type: 'code', text: '  return function (...args) {' },
      { type: 'code', text: '    const now = Date.now()' },
      { type: 'code', text: '    if (now - lastTime >= delay) {' },
      { type: 'code', text: '      fn.apply(this, args)' },
      { type: 'code', text: '      lastTime = now' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'note: Date.now() is static, NOT new Date().now()' },
      { type: 'warn', text: 'pattern: both util are higher-order fns returning closures' },
    ]
  },
  '0328': {
    day: 'Day 9',
    tasks: ['TASK-15 fixture spec', 'UTIL-CB Function.prototype refactor'],
    suites: ['algo', 'call'],
    detail: [
      { type: 'info', text: '── TASK-15  findTriplesSumZero  [P2 / medium] ──' },
      { type: 'log',  text: 'spec:    return all unique triples [a,b,c] from nums where a+b+c=0' },
      { type: 'log',  text: 'fixture: nums = [-1, 0, 1, 2, -1, -4]' },
      { type: 'log',  text: 'expect:  [[-1,-1,2], [-1,0,1]]' },
      { type: 'log',  text: 'constraint: no duplicate triples in result' },
      { type: 'pass', text: 'approach: sort + fix-one + two-pointer collision' },
      { type: 'code', text: 'nums.sort((a, b) => a - b)' },
      { type: 'code', text: 'for (let i = 0; i < n - 2; i++) {' },
      { type: 'code', text: '  if (nums[i] > 0) break              // optimization' },
      { type: 'code', text: '  if (i > 0 && nums[i] === nums[i-1]) continue   // dedup i' },
      { type: 'code', text: '  let left = i + 1, right = n - 1' },
      { type: 'code', text: '  while (left < right) {' },
      { type: 'code', text: '    const sum = nums[i] + nums[left] + nums[right]' },
      { type: 'code', text: '    if (sum < 0) left++' },
      { type: 'code', text: '    else if (sum > 0) right--' },
      { type: 'code', text: '    else {' },
      { type: 'code', text: '      result.push([nums[i], nums[left], nums[right]])' },
      { type: 'code', text: '      while (nums[left] === nums[left+1]) left++   // dedup L' },
      { type: 'code', text: '      while (nums[right] === nums[right-1]) right-- // dedup R' },
      { type: 'code', text: '      left++; right--' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'edge case: dedup required at 3 levels (i / left / right)' },
      { type: 'pass', text: 'perf: O(n²) time / O(1) extra space' },
      { type: 'log',  text: 'related: hash-lookup → collision-pointer → sort+collision' },
      { type: 'info', text: '── UTIL-CB  Function.prototype.myCall  [P1 / refactor] ──' },
      { type: 'log',  text: 'spec: rebind `this` context, pass args one by one' },
      { type: 'log',  text: 'usage: fn.myCall(ctx, a, b) === fn.call(ctx, a, b)' },
      { type: 'pass', text: 'core idea: "谁调用函数，this 就指向谁"' },
      { type: 'pass', text: 'trick: assign fn as temp method on ctx → ctx.fn() → this === ctx → delete' },
      { type: 'warn', text: 'key must be Symbol() — prevents collision with existing props on ctx' },
      { type: 'code', text: 'Function.prototype.myCall = function(ctx, ...args) {' },
      { type: 'code', text: '  ctx = ctx ?? globalThis                 // null/undefined → global' },
      { type: 'code', text: '  if (typeof ctx !== "object" && typeof ctx !== "function")' },
      { type: 'code', text: '    ctx = Object(ctx)                     // primitive → wrapper object' },
      { type: 'code', text: '  const key = Symbol("tempFn")            // unique key, zero collision' },
      { type: 'code', text: '  ctx[key] = this                         // this = the calling function' },
      { type: 'code', text: '  const result = ctx[key](...args)        // invoke as method → this === ctx' },
      { type: 'code', text: '  delete ctx[key]                         // cleanup, no trace' },
      { type: 'code', text: '  return result' },
      { type: 'code', text: '}' },
      { type: 'log',  text: 'real-world: Object.prototype.toString.call([]) → "[object Array]"' },
      { type: 'log',  text: 'real-world: Array.prototype.slice.call(arguments) → array-like → real array' },
      { type: 'info', text: '── UTIL-AP  Function.prototype.myApply  [P2 / bonus] ──' },
      { type: 'log',  text: 'spec: same as call, but args passed as array: fn.apply(ctx, [a, b])' },
      { type: 'pass', text: 'only diff from myCall: 2nd param is argsArray, spread when invoking' },
      { type: 'code', text: 'Function.prototype.myApply = function(ctx, argsArray) {' },
      { type: 'code', text: '  ctx = ctx ?? globalThis' },
      { type: 'code', text: '  if (typeof ctx !== "object" && typeof ctx !== "function") ctx = Object(ctx)' },
      { type: 'code', text: '  const key = Symbol("tempFn")' },
      { type: 'code', text: '  ctx[key] = this' },
      { type: 'code', text: '  const result = argsArray ? ctx[key](...argsArray) : ctx[key]()' },
      { type: 'code', text: '  delete ctx[key]' },
      { type: 'code', text: '  return result' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'ES6+: Math.max(...arr) replaced apply. apply mostly shows up in interviews now' },
      { type: 'info', text: '── UTIL-BD  Function.prototype.myBind  [P1 / refactor] ──' },
      { type: 'log',  text: 'spec: returns new function with bound `this`, supports partial args' },
      { type: 'log',  text: 'usage: const bound = fn.myBind(ctx, a); bound(b) === fn.call(ctx, a, b)' },
      { type: 'pass', text: 'key diff from call/apply: bind does NOT execute — returns a new function' },
      { type: 'pass', text: 'pattern: closure saves originalFn + context + outerArgs' },
      { type: 'code', text: 'Function.prototype.myBind = function(ctx, ...outerArgs) {' },
      { type: 'code', text: '  const originalFn = this              // must save — inner this will differ' },
      { type: 'code', text: '  return function boundFn(...innerArgs) {' },
      { type: 'code', text: '    return originalFn.call(ctx, ...outerArgs, ...innerArgs)' },
      { type: 'code', text: '  }                                      // outerArgs + innerArgs = partial application' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'advanced: if bound is called with new, this should be new instance not ctx' },
      { type: 'warn', text: 'detect via: this instanceof boundFn; need boundFn.prototype = Object.create(...)' },
      { type: 'log',  text: 'real-world: setInterval(this.tick.bind(this), 1000) — lock this in callbacks' },
      { type: 'log',  text: 'real-world: log.bind(null, "WARN", "DB") — partial application / prefill args' },
      { type: 'log',  text: 'real-world: React class component constructor this.handleClick.bind(this)' },
      { type: 'pass', text: 'ES6 arrow fn auto-captures this from lexical scope — often replaces bind' },
    ]
  },
  '0329': {
    day: 'Day 10 周日',
    tasks: ['regression: pointer fixtures', 'regression: PROMISE-IMPL', 'review backlog'],
    suites: ['weak', 'promise', 'algo'],
    detail: [
      { type: 'info', text: '── Week 2 裸写检测 ──' },
      { type: 'warn', text: '规则：空白编辑器，不查资料，不用 AI，限时完成' },
      { type: 'log',  text: '1. 双指针题 × 2（每题 15min）：从 #283/#11/#3 中挑' },
      { type: 'log',  text: '2. 手写题 × 1（10min）：深拷贝 or 防抖' },
      { type: 'log',  text: '3. 写完后自己检查，记录卡壳点' },
      { type: 'info', text: '── 重点回顾 ──' },
      { type: 'err',  text: 'ISSUE-001: 边界 off-by-one 3次（#283 s2++位置, #11 left--, #3 <=）' },
      { type: 'warn', text: 'ACTION: 双指针必须用 for 循环，检查 < vs <=，检查 ++ vs --' },
      { type: 'err',  text: 'ISSUE-002: Promise then() 两个坑点' },
      { type: 'warn', text: 'ACTION: "结果准备好了吗？" → yes: 立即执行 | no: 存箭头函数' },
      { type: 'err',  text: 'ISSUE-003: 数据结构选错（#438 用 Set, #3 用数组）' },
      { type: 'warn', text: 'ACTION: 先读题两遍，理解后再选数据结构' },
      { type: 'info', text: '── 评分标准 ──' },
      { type: 'pass', text: '⭐⭐⭐⭐⭐ 一遍过，思路清晰' },
      { type: 'pass', text: '⭐⭐⭐⭐ 小bug但能自己改对' },
      { type: 'warn', text: '⭐⭐⭐ 思路对但写不完整' },
      { type: 'warn', text: '⭐⭐ 思路模糊，靠记忆拼凑' },
      { type: 'err',  text: '⭐ 完全写不出来 → 下周必须重新学' },
    ]
  },
  '0330': {
    day: 'Day 11',
    tasks: ['UTIL-CR currying', 'UTIL-EE EventEmitter'],
    suites: ['curry'],
    detail: [
      { type: 'info', text: '── UTIL-CR  curry  [P2 / utility] ──' },
      { type: 'log',  text: 'spec: transform fn(a,b,c) → curried(a)(b)(c) or curried(a,b)(c) etc.' },
      { type: 'log',  text: 'usage: const add = (a,b,c) => a+b+c; curry(add)(1)(2)(3) === 6' },
      { type: 'pass', text: 'pattern: recursive collector, fire when args.length >= fn.length' },
      { type: 'code', text: 'function curry(fn) {' },
      { type: 'code', text: '  return function curried(...args) {' },
      { type: 'code', text: '    if (args.length >= fn.length) {       // enough args, fire' },
      { type: 'code', text: '      return fn.apply(this, args)' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '    return function (...newArgs) {        // collect more' },
      { type: 'code', text: '      return curried.apply(this, [...args, ...newArgs])' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'key: fn.length = declared param count of original fn' },
      { type: 'info', text: '── UTIL-EE  EventEmitter  [P1 / utility] ──' },
      { type: 'log',  text: 'spec: pubsub event bus with on / off / emit / once' },
      { type: 'log',  text: 'usage: e.on("click", fn); e.emit("click", payload); e.off("click", fn)' },
      { type: 'code', text: 'class EventEmitter {' },
      { type: 'code', text: '  constructor() { this.events = {} }' },
      { type: 'code', text: '  on(event, fn) {' },
      { type: 'code', text: '    if (!this.events[event]) this.events[event] = []' },
      { type: 'code', text: '    this.events[event].push(fn)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  off(event, fn) {' },
      { type: 'code', text: '    if (!this.events[event]) return' },
      { type: 'code', text: '    this.events[event] = this.events[event].filter(f => f !== fn)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  emit(event, ...args) {' },
      { type: 'code', text: '    if (!this.events[event]) return' },
      { type: 'code', text: '    this.events[event].forEach(fn => fn(...args))' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  once(event, fn) {' },
      { type: 'code', text: '    const wrapper = (...args) => { fn(...args); this.off(event, wrapper) }' },
      { type: 'code', text: '    this.on(event, wrapper)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'edge case: once() must register wrapper, not raw fn (off needs same ref)' },
    ]
  },
  '0331': {
    day: 'Day 12',
    tasks: ['UTIL-PA Promise.all', 'UTIL-IO instanceof'],
    suites: ['pall'],
    detail: [
      { type: 'info', text: '── UTIL-PA  promiseAll  [P1 / utility] ──' },
      { type: 'log',  text: 'spec: resolve when ALL resolve (results in input order), reject on ANY reject' },
      { type: 'log',  text: 'usage: promiseAll([p1, p2, p3]).then(arr => ...)' },
      { type: 'code', text: 'function promiseAll(promises) {' },
      { type: 'code', text: '  return new Promise((resolve, reject) => {' },
      { type: 'code', text: '    const results = []' },
      { type: 'code', text: '    let count = 0' },
      { type: 'code', text: '    promises.forEach((p, i) => {' },
      { type: 'code', text: '      Promise.resolve(p).then(val => {     // wrap non-promise too' },
      { type: 'code', text: '        results[i] = val                    // index, NOT push!' },
      { type: 'code', text: '        count++' },
      { type: 'code', text: '        if (count === promises.length) resolve(results)' },
      { type: 'code', text: '      }).catch(reject)' },
      { type: 'code', text: '    })' },
      { type: 'code', text: '  })' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'pitfall 1: results[i] not push() — async order != input order' },
      { type: 'warn', text: 'pitfall 2: count++ not results.length — sparse assignment lies' },
      { type: 'warn', text: 'pitfall 3: Promise.resolve(p) wraps non-promise inputs' },
      { type: 'info', text: '── UTIL-IO  myInstanceof  [P1 / utility] ──' },
      { type: 'log',  text: 'spec: walk obj prototype chain, return true if hits constructor.prototype' },
      { type: 'log',  text: 'usage: myInstanceof([], Array) === true' },
      { type: 'code', text: 'function myInstanceof(obj, constructor) {' },
      { type: 'code', text: '  if (obj === null || typeof obj !== "object") return false' },
      { type: 'code', text: '  let proto = Object.getPrototypeOf(obj)    // standard, not __proto__' },
      { type: 'code', text: '  while (proto !== null) {' },
      { type: 'code', text: '    if (proto === constructor.prototype) return true' },
      { type: 'code', text: '    proto = Object.getPrototypeOf(proto)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return false' },
      { type: 'code', text: '}' },
      { type: 'pass', text: 'Object.getPrototypeOf is standard, __proto__ is non-standard' },
    ]
  },
  '0401': {
    day: 'Day 13',
    tasks: ['read: closure / prototype chain', 'TASK-42 trapRainWater'],
    suites: ['algo', 'weak'],
    detail: [
      { type: 'info', text: '── TASK-42  trapRainWater  [P3 / hard] ──' },
      { type: 'log',  text: 'spec: given heights[], compute total trapped rain water (unit width 1)' },
      { type: 'log',  text: 'fixture: [0,1,0,2,1,0,1,3,2,1,2,1]' },
      { type: 'log',  text: 'expect:  6' },
      { type: 'pass', text: 'core: water[i] = min(leftMax, rightMax) - height[i]' },
      { type: 'info', text: '── variant A: precompute (easier to grok) ──' },
      { type: 'code', text: 'function trap(height) {' },
      { type: 'code', text: '  const n = height.length' },
      { type: 'code', text: '  const leftMax = new Array(n)' },
      { type: 'code', text: '  const rightMax = new Array(n)' },
      { type: 'code', text: '  leftMax[0] = height[0]' },
      { type: 'code', text: '  for (let i = 1; i < n; i++)' },
      { type: 'code', text: '    leftMax[i] = Math.max(leftMax[i-1], height[i])' },
      { type: 'code', text: '  rightMax[n-1] = height[n-1]' },
      { type: 'code', text: '  for (let i = n-2; i >= 0; i--)' },
      { type: 'code', text: '    rightMax[i] = Math.max(rightMax[i+1], height[i])' },
      { type: 'code', text: '  let water = 0' },
      { type: 'code', text: '  for (let i = 0; i < n; i++)' },
      { type: 'code', text: '    water += Math.min(leftMax[i], rightMax[i]) - height[i]' },
      { type: 'code', text: '  return water' },
      { type: 'code', text: '}' },
      { type: 'pass', text: 'O(n) time, O(n) space' },
      { type: 'info', text: '── variant B: two-pointer (optimal) ──' },
      { type: 'code', text: 'function trap(height) {' },
      { type: 'code', text: '  let l = 0, r = height.length - 1' },
      { type: 'code', text: '  let lMax = 0, rMax = 0, water = 0' },
      { type: 'code', text: '  while (l < r) {' },
      { type: 'code', text: '    if (height[l] < height[r]) {     // process shorter side' },
      { type: 'code', text: '      lMax = Math.max(lMax, height[l])' },
      { type: 'code', text: '      water += lMax - height[l]' },
      { type: 'code', text: '      l++' },
      { type: 'code', text: '    } else {' },
      { type: 'code', text: '      rMax = Math.max(rMax, height[r])' },
      { type: 'code', text: '      water += rMax - height[r]' },
      { type: 'code', text: '      r--' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return water' },
      { type: 'code', text: '}' },
      { type: 'pass', text: 'O(n) time, O(1) space' },
      { type: 'warn', text: 'why move shorter? if h[l] < h[r], lMax is trustworthy → safely compute l' },
    ]
  },
  '0402': {
    day: 'Day 14',
    tasks: ['read: reactive system intro', 'TASK-206 reverseList'],
    suites: ['algo'],
    detail: [
      { type: 'info', text: '── TASK-206  reverseList  [P0 / easy] ──' },
      { type: 'log',  text: 'spec: reverse a singly linked list in place' },
      { type: 'log',  text: 'fixture: 1 → 2 → 3 → 4 → 5' },
      { type: 'log',  text: 'expect:  5 → 4 → 3 → 2 → 1' },
      { type: 'pass', text: 'pattern: 3-pointer (prev / curr / next), O(1) extra space' },
      { type: 'code', text: 'function reverseList(head) {' },
      { type: 'code', text: '  let prev = null' },
      { type: 'code', text: '  let curr = head' },
      { type: 'code', text: '  while (curr) {' },
      { type: 'code', text: '    const next = curr.next       // 1. cache forward link' },
      { type: 'code', text: '    curr.next = prev             // 2. flip pointer' },
      { type: 'code', text: '    prev = curr                  // 3. advance prev' },
      { type: 'code', text: '    curr = next                  // 4. advance curr' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return prev                    // new head' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'tip: linked list problems = draw on paper, never solve in head' },
      { type: 'info', text: '── variant: recursive (bonus, harder to reason) ──' },
      { type: 'code', text: 'function reverseList(head) {' },
      { type: 'code', text: '  if (!head || !head.next) return head' },
      { type: 'code', text: '  const newHead = reverseList(head.next)' },
      { type: 'code', text: '  head.next.next = head        // flip the link' },
      { type: 'code', text: '  head.next = null             // break original forward link' },
      { type: 'code', text: '  return newHead' },
      { type: 'code', text: '}' },
      { type: 'log',  text: 'related: linked list series → reverse → merge → cycle detection' },
    ]
  },
  '0403': {
    day: 'Day 15',
    tasks: ['TASK-21 mergeTwoSortedLists', 'read: Vue3 reactive intro'],
    suites: ['linked', 'algo'],
    detail: [
      { type: 'info', text: '── TASK-21  mergeTwoSortedLists  [P0 / easy] ──' },
      { type: 'log',  text: 'spec: merge two sorted linked lists into one sorted list' },
      { type: 'log',  text: 'fixture: l1=[1,2,4], l2=[1,3,4]' },
      { type: 'log',  text: 'expect:  [1,1,2,3,4,4]' },
      { type: 'pass', text: 'pattern: dummy head + compare & append' },
      { type: 'code', text: 'function mergeTwoLists(l1, l2) {' },
      { type: 'code', text: '  const dummy = { next: null }' },
      { type: 'code', text: '  let curr = dummy' },
      { type: 'code', text: '  while (l1 && l2) {' },
      { type: 'code', text: '    if (l1.val <= l2.val) {' },
      { type: 'code', text: '      curr.next = l1; l1 = l1.next' },
      { type: 'code', text: '    } else {' },
      { type: 'code', text: '      curr.next = l2; l2 = l2.next' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '    curr = curr.next' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  curr.next = l1 || l2       // append remaining' },
      { type: 'code', text: '  return dummy.next' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'dummy node: 避免处理头节点特殊情况，链表题常用技巧' },
      { type: 'pass', text: 'O(n+m) time, O(1) space' },
    ]
  },
  '0404': {
    day: 'Day 16',
    tasks: ['TASK-141 hasCycle', 'read: Vue3 reactive proxy'],
    suites: ['linked', 'algo'],
    detail: [
      { type: 'info', text: '── TASK-141  hasCycle  [P0 / easy] ──' },
      { type: 'log',  text: 'spec: determine if a linked list has a cycle' },
      { type: 'log',  text: 'fixture: [3,2,0,-4] pos=1 (tail connects to index 1)' },
      { type: 'log',  text: 'expect:  true' },
      { type: 'pass', text: 'pattern: Floyd\'s tortoise & hare (fast-slow pointer)' },
      { type: 'code', text: 'function hasCycle(head) {' },
      { type: 'code', text: '  let slow = head, fast = head' },
      { type: 'code', text: '  while (fast && fast.next) {' },
      { type: 'code', text: '    slow = slow.next' },
      { type: 'code', text: '    fast = fast.next.next' },
      { type: 'code', text: '    if (slow === fast) return true' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return false' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'while条件: fast && fast.next (fast走2步，都要检查)' },
      { type: 'pass', text: 'why must meet? 进环后每步距离缩小1，必定追上' },
      { type: 'pass', text: 'O(n) time, O(1) space — 比 HashSet 方案省空间' },
    ]
  },
  '0405': {
    day: 'Day 17 周日',
    tasks: ['regression: linked list 2 题 (15min)', 'regression: call/bind (10min)', 'review Week 3'],
    suites: ['linked', 'call', 'weak'],
    detail: [
      { type: 'info', text: '── Week 3 裸写检测 ──' },
      { type: 'warn', text: '规则：空白编辑器，不查资料，不用 AI，限时完成' },
      { type: 'log',  text: '1. 链表题 × 2（每题 15min）：从 #206/#21/#141 中随机挑' },
      { type: 'log',  text: '2. 手写题 × 1（10min）：call 或 bind' },
      { type: 'log',  text: '3. 写完后自己检查，记录卡壳点' },
      { type: 'info', text: '── 评分标准 ──' },
      { type: 'pass', text: '⭐⭐⭐⭐⭐ 一遍过，思路清晰' },
      { type: 'pass', text: '⭐⭐⭐⭐ 小bug但能自己改对' },
      { type: 'warn', text: '⭐⭐⭐ 思路对但写不完整' },
      { type: 'warn', text: '⭐⭐ 思路模糊，靠记忆拼凑' },
      { type: 'err',  text: '⭐ 完全写不出来 → 下周必须重新学' },
    ]
  },
  '0406': {
    day: 'Day 18',
    tasks: ['TASK-142 detectCycle', 'review: linked list patterns'],
    suites: ['linked', 'algo'],
    detail: [
      { type: 'info', text: '── TASK-142  detectCycle  [P2 / medium] ──' },
      { type: 'log',  text: 'spec: return the node where the cycle begins, or null' },
      { type: 'log',  text: 'fixture: [3,2,0,-4] pos=1' },
      { type: 'log',  text: 'expect:  node at index 1 (val=2)' },
      { type: 'pass', text: 'pattern: 2 phases — find meeting point, then find entrance' },
      { type: 'code', text: 'function detectCycle(head) {' },
      { type: 'code', text: '  let slow = head, fast = head' },
      { type: 'code', text: '  while (fast && fast.next) {' },
      { type: 'code', text: '    slow = slow.next' },
      { type: 'code', text: '    fast = fast.next.next' },
      { type: 'code', text: '    if (slow === fast) {         // phase 1: found meeting' },
      { type: 'code', text: '      let ptr = head' },
      { type: 'code', text: '      while (ptr !== slow) {     // phase 2: find entrance' },
      { type: 'code', text: '        ptr = ptr.next' },
      { type: 'code', text: '        slow = slow.next' },
      { type: 'code', text: '      }' },
      { type: 'code', text: '      return ptr' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return null' },
      { type: 'code', text: '}' },
      { type: 'info', text: '── math proof (面试追问) ──' },
      { type: 'log',  text: 'head→入口: a步, 入口→相遇: b步, 环长: c' },
      { type: 'log',  text: 'slow走: a+b, fast走: a+b+nc, fast=2*slow' },
      { type: 'log',  text: '∴ a+b = nc → a = nc-b = (n-1)c + (c-b)' },
      { type: 'log',  text: '∴ 从head走a步 = 从相遇点走(c-b)步 → 都到入口' },
      { type: 'warn', text: 'key formula: a = (n-1)c + (c-b)，建议背住' },
    ]
  },
  '0407': {
    day: 'Day 19',
    tasks: ['TASK-19 removeNthFromEnd', 'read: Vue3 computed/watch'],
    suites: ['linked', 'algo'],
    detail: [
      { type: 'info', text: '── TASK-19  removeNthFromEnd  [P2 / medium] ──' },
      { type: 'log',  text: 'spec: remove nth node from end of list, return head' },
      { type: 'log',  text: 'fixture: [1,2,3,4,5], n=2' },
      { type: 'log',  text: 'expect:  [1,2,3,5]' },
      { type: 'pass', text: 'pattern: dummy + fast-slow gap of n+1' },
      { type: 'code', text: 'function removeNthFromEnd(head, n) {' },
      { type: 'code', text: '  const dummy = { next: head }' },
      { type: 'code', text: '  let fast = dummy, slow = dummy' },
      { type: 'code', text: '  for (let i = 0; i <= n; i++) fast = fast.next  // n+1 steps' },
      { type: 'code', text: '  while (fast) {' },
      { type: 'code', text: '    fast = fast.next' },
      { type: 'code', text: '    slow = slow.next' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  slow.next = slow.next.next   // skip target' },
      { type: 'code', text: '  return dummy.next' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'fast先走 n+1 步不是 n 步！slow要停在目标的前一个节点' },
      { type: 'warn', text: 'dummy node: 删除头节点时（如[1], n=1）也能正确处理' },
      { type: 'pass', text: 'O(n) time, O(1) space — 一次遍历' },
    ]
  },
  '0408': {
    day: 'Day 20',
    tasks: ['TASK-160 getIntersectionNode', 'summary: linked list patterns'],
    suites: ['linked', 'algo'],
    detail: [
      { type: 'info', text: '── TASK-160  getIntersectionNode  [P0 / easy] ──' },
      { type: 'log',  text: 'spec: find the node where two singly linked lists intersect' },
      { type: 'log',  text: 'fixture: A=[4,1,8,4,5], B=[5,6,1,8,4,5], intersect at 8' },
      { type: 'pass', text: 'pattern: cross-traverse to eliminate length diff' },
      { type: 'code', text: 'function getIntersectionNode(headA, headB) {' },
      { type: 'code', text: '  let pA = headA, pB = headB' },
      { type: 'code', text: '  while (pA !== pB) {' },
      { type: 'code', text: '    pA = pA ? pA.next : headB' },
      { type: 'code', text: '    pB = pB ? pB.next : headA' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return pA' },
      { type: 'code', text: '}' },
      { type: 'log',  text: 'A链长a+c, B链长b+c (c=公共部分)' },
      { type: 'log',  text: 'pA走 a+c+b 步, pB走 b+c+a 步 → 同时到交点' },
      { type: 'warn', text: '无交点时: pA和pB都走到null, null===null → return null' },
      { type: 'pass', text: 'O(n+m) time, O(1) space — 代码极简但思路精妙' },
      { type: 'info', text: '── 链表系列总结 ──' },
      { type: 'pass', text: '#206 反转: prev/curr/next 三指针' },
      { type: 'pass', text: '#21  合并: dummy head + 逐个比较' },
      { type: 'pass', text: '#141 环检测: 快慢指针，追上就有环' },
      { type: 'pass', text: '#142 环入口: 相遇后从head同速走' },
      { type: 'pass', text: '#19  删倒N: dummy + 间隔n+1的快慢' },
      { type: 'pass', text: '#160 相交: 交替遍历消除长度差' },
      { type: 'warn', text: 'common tricks: dummy node / fast-slow / 画图' },
    ]
  },
  '0409': {
    day: 'Day 21',
    tasks: ['TASK-20 isValid (括号匹配)', 'read: Vue3 compiler intro'],
    suites: ['stack', 'algo'],
    detail: [
      { type: 'info', text: '── TASK-20  isValid  [P0 / easy] ──' },
      { type: 'log',  text: 'spec: check if string of brackets is valid' },
      { type: 'log',  text: 'fixture: "()[]{}" → true, "(]" → false, "{[]}" → true' },
      { type: 'pass', text: 'pattern: stack + map (right→left bracket mapping)' },
      { type: 'code', text: 'function isValid(s) {' },
      { type: 'code', text: '  const stack = []' },
      { type: 'code', text: '  const map = { ")": "(", "]": "[", "}": "{" }' },
      { type: 'code', text: '  for (const c of s) {' },
      { type: 'code', text: '    if (!map[c]) {' },
      { type: 'code', text: '      stack.push(c)              // left bracket → push' },
      { type: 'code', text: '    } else {' },
      { type: 'code', text: '      if (stack.pop() !== map[c]) return false  // mismatch' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return stack.length === 0       // must be empty!' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'TRAP: 最后必须 stack.length === 0，不能直接 return true' },
      { type: 'log',  text: '反例: "(((" 遍历完不报错，但栈不为空 → 无效' },
      { type: 'pass', text: 'O(n) time, O(n) space — 栈最经典应用' },
    ]
  },
  '0410': {
    day: 'Day 22',
    tasks: ['TASK-155 MinStack', 'read: Vue3 diff algorithm'],
    suites: ['stack', 'algo'],
    detail: [
      { type: 'info', text: '── TASK-155  MinStack  [P2 / medium] ──' },
      { type: 'log',  text: 'spec: design a stack that supports push, pop, top, getMin in O(1)' },
      { type: 'log',  text: 'fixture: push(-2), push(0), push(-3), getMin()→-3, pop(), getMin()→-2' },
      { type: 'pass', text: 'pattern: auxiliary min-stack, synchronized push/pop' },
      { type: 'code', text: 'class MinStack {' },
      { type: 'code', text: '  constructor() {' },
      { type: 'code', text: '    this.stack = []' },
      { type: 'code', text: '    this.minStack = []' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  push(val) {' },
      { type: 'code', text: '    this.stack.push(val)' },
      { type: 'code', text: '    const min = this.minStack.length === 0' },
      { type: 'code', text: '      ? val : Math.min(val, this.minStack.at(-1))' },
      { type: 'code', text: '    this.minStack.push(min)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  pop() { this.stack.pop(); this.minStack.pop() }' },
      { type: 'code', text: '  top() { return this.stack.at(-1) }' },
      { type: 'code', text: '  getMin() { return this.minStack.at(-1) }' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'key insight: 辅助栈与主栈同步，栈顶始终是当前状态最小值' },
      { type: 'warn', text: 'why not single var? pop时无法恢复之前的最小值' },
      { type: 'pass', text: 'all operations O(1) time — 空间换时间的经典思路' },
    ]
  },
}

function renderDaily(dateKey) {
  const data = daily[dateKey]
  if (!data) {
    console.log(`${C.red}Error: no plan for '${dateKey}'${C.reset}`)
    console.log(`${C.dim}Available dates: ${Object.keys(daily).join(', ')}${C.reset}`)
    return
  }

  const dateStr = `2026-${dateKey.slice(0,2)}-${dateKey.slice(2,4)}`
  console.log()
  console.log(`${C.dim}[${dateStr}]${C.reset} ${C.bold}${C.white}Sprint Backlog — ${data.day}${C.reset}`)
  console.log(`${C.dim}${'─'.repeat(60)}${C.reset}`)

  console.log(`  ${C.cyan}── tickets ──${C.reset}`)
  data.tasks.forEach((t, i) => {
    console.log(`  ${C.green}[ ]${C.reset} ${C.white}${t}${C.reset}`)
  })

  // 渲染当天详细任务说明（如果有）
  if (data.detail) {
    console.log()
    data.detail.forEach(item => {
      switch (item.type) {
        case 'pass':
          console.log(`  ${C.green}✓${C.reset} ${C.green}${item.text}${C.reset}`)
          break
        case 'warn':
          console.log(`  ${C.yellow}⚠${C.reset} ${C.yellow}${item.text}${C.reset}`)
          break
        case 'err':
          console.log(`  ${C.red}✗${C.reset} ${C.red}${item.text}${C.reset}`)
          break
        case 'info':
          console.log(`  ${C.cyan}${item.text}${C.reset}`)
          break
        case 'code':
          console.log(`  ${C.gray}│${C.reset} ${C.white}${item.text}${C.reset}`)
          break
        case 'log':
        default:
          console.log(`  ${C.dim}${item.text}${C.reset}`)
      }
    })
  }

  console.log()
  console.log(`  ${C.cyan}── see also (rr <name>) ──${C.reset}`)
  data.suites.forEach(s => {
    const title = topics[s]?.title || s
    console.log(`  ${C.dim}→${C.reset} ${C.yellow}rr ${s}${C.reset} ${C.dim}(${title})${C.reset}`)
  })

  console.log(`${C.dim}${'─'.repeat(60)}${C.reset}`)
  console.log()
}

// ─── Main ───
const arg = process.argv[2]
if (!arg || arg === '-h' || arg === '--help') {
  showHelp()
} else if (arg === 'all') {
  Object.keys(topics).forEach(k => render(k))
} else if (arg === 'hw') {
  const date = process.argv[3]
  if (!date || !/^\d{4}$/.test(date)) {
    console.log(`${C.yellow}Usage: rr hw MMDD${C.reset}`)
    console.log(`${C.dim}Available: ${require('fs').readdirSync(__dirname + '/homework').filter(f=>f.endsWith('.js')).map(f=>f.replace('.js','')).join(', ')}${C.reset}`)
  } else {
    const file = `${__dirname}/homework/${date}.js`
    if (require('fs').existsSync(file)) {
      console.log(`${C.green}Opening homework/${date}.js ...${C.reset}`)
      require('child_process').execSync(`open "${file}"`)
    } else {
      console.log(`${C.red}No homework for ${date}${C.reset}`)
      console.log(`${C.dim}Available: ${require('fs').readdirSync(__dirname + '/homework').filter(f=>f.endsWith('.js')).map(f=>f.replace('.js','')).join(', ')}${C.reset}`)
    }
  }
} else if (/^\d{4}$/.test(arg)) {
  renderDaily(arg)
} else {
  const key = Object.keys(topics).find(k => k.startsWith(arg))
  if (key) render(key)
  else {
    console.log(`${C.red}Error: no matching suite for '${arg}'${C.reset}`)
    showHelp()
  }
}
