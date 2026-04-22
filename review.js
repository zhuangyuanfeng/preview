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
      { type: 'pass', text: 'sync code executes first on call stack' },
      { type: 'pass', text: 'microtask queue drains completely before macrotask' },
      { type: 'pass', text: 'Promise.then → microtask | setTimeout → macrotask' },
      { type: 'pass', text: 'new Promise(executor) runs synchronously' },
      { type: 'pass', text: 'await x → code after await = x.then(callback) = microtask' },
      { type: 'warn', text: 'nested microtask executes in current round, not next' },
      { type: 'info', text: '── execution order ──' },
      { type: 'log',  text: '1. sync code (call stack)' },
      { type: 'log',  text: '2. drain ALL microtasks (Promise.then, await)' },
      { type: 'log',  text: '3. pick ONE macrotask (setTimeout, I/O)' },
      { type: 'log',  text: '4. goto step 2' },
      { type: 'info', text: '── quiz: output order ──' },
      { type: 'log',  text: 'console.log(1); setTimeout(()=>log(2),0); Promise.resolve().then(()=>log(3)); log(4)' },
      { type: 'pass', text: 'answer: 1 4 3 2' },
      { type: 'info', text: '── Node.js diff ──' },
      { type: 'log',  text: 'process.nextTick > Promise.then > setTimeout > setImmediate' },
    ]
  },

  promise: {
    title: 'Promise Implementation - Build Verification',
    content: [
      { type: 'info', text: '── 状态机 ──' },
      { type: 'pass', text: 'pending → fulfilled (resolve) | pending → rejected (reject)' },
      { type: 'pass', text: 'state change is irreversible' },
      { type: 'pass', text: 'executor runs synchronously in constructor' },
      { type: 'info', text: '── Step 1: 基础骨架 ──' },
      { type: 'code', text: 'class MyPromise {' },
      { type: 'code', text: '  constructor(executor) {' },
      { type: 'code', text: '    this.state = "pending"' },
      { type: 'code', text: '    this.value = undefined' },
      { type: 'code', text: '    this.reason = undefined' },
      { type: 'code', text: '    const resolve = (value) => {' },
      { type: 'code', text: '      if (this.state === "pending") {  // 保证不可逆' },
      { type: 'code', text: '        this.state = "fulfilled"; this.value = value' },
      { type: 'code', text: '      }' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '    const reject = (reason) => { /* 同理 */ }' },
      { type: 'code', text: '    try { executor(resolve, reject) } catch(e) { reject(e) }' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'info', text: '── Step 2: then（同步版）──' },
      { type: 'code', text: 'then(onFulfilled, onRejected) {' },
      { type: 'code', text: '  if (this.state === "fulfilled") onFulfilled(this.value)' },
      { type: 'code', text: '  if (this.state === "rejected") onRejected(this.reason)' },
      { type: 'code', text: '}' },
      { type: 'err',  text: 'PROBLEM: 异步 executor 时 then 执行时 state 还是 pending' },
      { type: 'info', text: '── example ──' },
      { type: 'code', text: 'const p = new MyPromise((resolve) => {' },
      { type: 'code', text: '  setTimeout(() => resolve("done"), 1000)  // 1秒后才 resolve' },
      { type: 'code', text: '})' },
      { type: 'code', text: 'p.then(val => console.log(val))  // ❌ then 立刻执行，此时 state 还是 pending' },
      { type: 'log',  text: 'then 执行时 resolve 还没调用 → state="pending" → 两个 if 都不进 → 回调丢失' },
      { type: 'log',  text: 'solution: pending 时把回调存到数组，等 resolve 时再遍历执行' },
      { type: 'info', text: '── Step 3: 支持异步（回调存储）──' },
      { type: 'code', text: 'constructor 里加:' },
      { type: 'code', text: '  this.onFulfilledCallbacks = []' },
      { type: 'code', text: '  this.onRejectedCallbacks = []' },
      { type: 'code', text: 'resolve 里加:' },
      { type: 'code', text: '  this.onFulfilledCallbacks.forEach(fn => fn())' },
      { type: 'code', text: 'then 里加:' },
      { type: 'code', text: '  if (this.state === "pending") {' },
      { type: 'code', text: '    this.onFulfilledCallbacks.push(() => onFulfilled(this.value))' },
      { type: 'code', text: '    this.onRejectedCallbacks.push(() => onRejected(this.reason))' },
      { type: 'code', text: '  }' },
      { type: 'info', text: '── 你的坑点 ──' },
      { type: 'warn', text: 'TRAP: push onFulfilled() ← () 导致立即调用! 要 push () => onFulfilled(this.value)' },
      { type: 'warn', text: 'TRAP: fulfilled 时别 push 到数组, 要直接执行 onFulfilled(this.value)' },
    ]
  },

  deep: {
    title: 'DeepClone Module - Coverage Report',
    content: [
      { type: 'warn', text: 'JSON.parse(JSON.stringify()) fails: fn, undefined, circular, Date, RegExp' },
      { type: 'info', text: '── example ──' },
      { type: 'code', text: 'const obj = { fn: ()=>{}, undef: undefined, date: new Date(), reg: /abc/ }' },
      { type: 'code', text: 'JSON.parse(JSON.stringify(obj))' },
      { type: 'code', text: '// → { date: "2026-04-03T...", reg: {} }  fn 和 undef 直接丢失！date 变字符串！' },
      { type: 'info', text: '── Step 1: 基础版（无循环引用处理）──' },
      { type: 'code', text: 'function deepClone(obj) {' },
      { type: 'code', text: '  if (obj === null || typeof obj !== "object") return obj' },
      { type: 'code', text: '  const clone = Array.isArray(obj) ? [] : {}' },
      { type: 'code', text: '  for (const key in obj) {' },
      { type: 'code', text: '    if (obj.hasOwnProperty(key)) clone[key] = deepClone(obj[key])' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return clone' },
      { type: 'code', text: '}' },
      { type: 'err',  text: 'PROBLEM: circular reference → stack overflow' },
      { type: 'info', text: '── example ──' },
      { type: 'code', text: 'const obj = { name: "test" }' },
      { type: 'code', text: 'obj.self = obj  // obj.self → obj → obj.self → obj → ...' },
      { type: 'code', text: 'deepClone(obj)  // ❌ RangeError: Maximum call stack size exceeded' },
      { type: 'log',  text: 'deepClone(obj) → deepClone(obj.self) → deepClone(obj.self.self) → ...' },
      { type: 'log',  text: 'self 指向 obj 自身，递归永远不会停，直到栈溢出' },
      { type: 'info', text: '── Step 2: 加 WeakMap（解决循环引用）──' },
      { type: 'code', text: 'function deepClone(obj, map = new WeakMap()) {' },
      { type: 'code', text: '  if (obj === null || typeof obj !== "object") return obj' },
      { type: 'code', text: '  if (map.has(obj)) return map.get(obj)  // 已拷贝过，直接返回' },
      { type: 'code', text: '  const clone = Array.isArray(obj) ? [] : {}' },
      { type: 'code', text: '  map.set(obj, clone)  // 先注册再递归！' },
      { type: 'code', text: '  for (const key in obj) {' },
      { type: 'code', text: '    if (obj.hasOwnProperty(key)) clone[key] = deepClone(obj[key], map)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return clone' },
      { type: 'code', text: '}' },
      { type: 'pass', text: 'WeakMap: weak ref, auto GC, no memory leak' },
      { type: 'info', text: '── Step 3: 处理特殊类型（完整版）──' },
      { type: 'code', text: 'function deepClone(obj, map = new WeakMap()) {' },
      { type: 'code', text: '  if (obj === null || typeof obj !== "object") return obj' },
      { type: 'code', text: '  if (map.has(obj)) return map.get(obj)' },
      { type: 'code', text: '  if (obj instanceof Date) return new Date(obj)' },
      { type: 'code', text: '  if (obj instanceof RegExp) return new RegExp(obj)' },
      { type: 'code', text: '  const clone = Array.isArray(obj) ? [] : {}' },
      { type: 'code', text: '  map.set(obj, clone)' },
      { type: 'code', text: '  for (const key of Reflect.ownKeys(obj)) {  // 含 Symbol' },
      { type: 'code', text: '    clone[key] = deepClone(obj[key], map)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return clone' },
      { type: 'code', text: '}' },
      { type: 'info', text: '── 未来要写到 Step 2 就够，Step 3 是这么做更好 ──' },
    ]
  },

  debounce: {
    title: 'Debounce & Throttle - Performance Test',
    content: [
      { type: 'info', text: '══ 防抖 Debounce ══' },
      { type: 'log',  text: '场景：搜索框输入、窗口 resize → 停止触发后才执行' },
      { type: 'info', text: '── Step 1: 基础版 ──' },
      { type: 'code', text: 'function debounce(fn, delay) {' },
      { type: 'code', text: '  let timer = null' },
      { type: 'code', text: '  return function(...args) {' },
      { type: 'code', text: '    clearTimeout(timer)         // 每次都重置' },
      { type: 'code', text: '    timer = setTimeout(() => {' },
      { type: 'code', text: '      fn.apply(this, args)' },
      { type: 'code', text: '    }, delay)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'info', text: '── Step 2: 带 immediate（leading） ──' },
      { type: 'code', text: 'function debounce(fn, delay, immediate = false) {' },
      { type: 'code', text: '  let timer = null' },
      { type: 'code', text: '  return function(...args) {' },
      { type: 'code', text: '    if (immediate && !timer) fn.apply(this, args)  // 首次立即执行' },
      { type: 'code', text: '    clearTimeout(timer)' },
      { type: 'code', text: '    timer = setTimeout(() => {' },
      { type: 'code', text: '      timer = null' },
      { type: 'code', text: '      if (!immediate) fn.apply(this, args)' },
      { type: 'code', text: '    }, delay)' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'pass', text: 'immediate: 防按钮重复点击，第一次立即执行后续忽略' },
      { type: 'info', text: '══ 节流 Throttle ══' },
      { type: 'log',  text: '场景：滚动加载、mousemove → 固定间隔执行一次' },
      { type: 'info', text: '── Step 1: 时间戳版（leading，首次立即执行）──' },
      { type: 'code', text: 'function throttle(fn, delay) {' },
      { type: 'code', text: '  let lastTime = 0' },
      { type: 'code', text: '  return function(...args) {' },
      { type: 'code', text: '    const now = Date.now()' },
      { type: 'code', text: '    if (now - lastTime >= delay) {' },
      { type: 'code', text: '      fn.apply(this, args)' },
      { type: 'code', text: '      lastTime = now' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'info', text: '── Step 2: 定时器版（trailing，最后一次也执行）──' },
      { type: 'code', text: 'function throttle(fn, delay) {' },
      { type: 'code', text: '  let timer = null' },
      { type: 'code', text: '  return function(...args) {' },
      { type: 'code', text: '    if (!timer) {' },
      { type: 'code', text: '      timer = setTimeout(() => {' },
      { type: 'code', text: '        fn.apply(this, args)' },
      { type: 'code', text: '        timer = null' },
      { type: 'code', text: '      }, delay)' },
      { type: 'code', text: '    }' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'info', text: '── 区别 ──' },
      { type: 'pass', text: '时间戳版: 第一次立即执行，最后一次不执行 (leading)' },
      { type: 'pass', text: '定时器版: 第一次delay后执行，最后一次也执行 (trailing)' },
      { type: 'warn', text: '未来实现：基础版防抖 + 时间戳版节流就够' },
    ]
  },

  call: {
    title: 'Function.prototype - Method Binding Tests',
    content: [
      { type: 'info', text: '── 原理：把函数挂为 context 的临时方法来调用 ──' },
      { type: 'info', text: '── call（立即调用，参数逐个传）──' },
      { type: 'code', text: 'Function.prototype.myCall = function(context, ...args) {' },
      { type: 'code', text: '  context = context || window' },
      { type: 'code', text: '  const key = Symbol()       // 唯一key，避免覆盖已有属性' },
      { type: 'code', text: '  context[key] = this         // 把函数挂为 context 的方法' },
      { type: 'code', text: '  const result = context[key](...args)  // 作为方法调用→this=context' },
      { type: 'code', text: '  delete context[key]         // 清理临时属性' },
      { type: 'code', text: '  return result' },
      { type: 'code', text: '}' },
      { type: 'info', text: '── apply（和 call 唯一区别：参数是数组）──' },
      { type: 'code', text: 'myApply = function(context, args = []) { ... context[key](...args) ... }' },
      { type: 'info', text: '── bind（返回新函数，不立即调用）──' },
      { type: 'code', text: 'Function.prototype.myBind = function(context, ...args) {' },
      { type: 'code', text: '  const fn = this              // 保存原函数引用' },
      { type: 'code', text: '  return function(...newArgs) { // 返回新函数（闭包）' },
      { type: 'code', text: '    return fn.apply(context, [...args, ...newArgs])  // 合并参数' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '}' },
      { type: 'info', text: '── 核心记忆 ──' },
      { type: 'pass', text: 'call/apply: context[Symbol()] = this → 方法调用 → delete' },
      { type: 'pass', text: 'bind: 闭包 + apply = 延迟执行' },
      { type: 'pass', text: 'Symbol() 保证 key 唯一不冲突' },
    ]
  },

  curry: {
    title: 'Currying & PubSub - Pattern Tests',
    content: [
      { type: 'info', text: '══ 柯里化 Currying ══' },
      { type: 'log',  text: 'add(1,2,3) → curry(add)(1)(2)(3) / curry(add)(1,2)(3)' },
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
      { type: 'pass', text: 'fn.length: 函数的形参个数，用来判断参数是否收集够' },
      { type: 'info', text: '══ 发布订阅 EventEmitter ══' },
      { type: 'log',  text: 'Vue $emit/$on, Node EventEmitter 都是这个模式' },
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
      { type: 'warn', text: 'once 的 off 要传 wrapper 不是 fn，因为 on 注册的是 wrapper' },
    ]
  },

  pall: {
    title: 'Promise.all & instanceof - Utility Tests',
    content: [
      { type: 'info', text: '══ Promise.all ══' },
      { type: 'log',  text: '全部 resolve → resolve(结果数组) | 任一 reject → reject' },
      { type: 'info', text: '── 实现 ──' },
      { type: 'code', text: 'function promiseAll(promises) {' },
      { type: 'code', text: '  return new Promise((resolve, reject) => {' },
      { type: 'code', text: '    const results = []' },
      { type: 'code', text: '    let count = 0' },
      { type: 'code', text: '    promises.forEach((p, i) => {' },
      { type: 'code', text: '      Promise.resolve(p).then(val => {  // Promise.resolve 处理非Promise值' },
      { type: 'code', text: '        results[i] = val   // 用 i 保证顺序！不能 push' },
      { type: 'code', text: '        count++' },
      { type: 'code', text: '        if (count === promises.length) resolve(results)' },
      { type: 'code', text: '      }).catch(reject)' },
      { type: 'code', text: '    })' },
      { type: 'code', text: '  })' },
      { type: 'code', text: '}' },
      { type: 'warn', text: 'results[i] 不是 push: 异步完成顺序不确定，用索引保证顺序' },
      { type: 'warn', text: 'count 不是 results.length: 稀疏赋值时 length 可能提前等于总数' },
      { type: 'pass', text: 'Promise.resolve(p) 包一层: 输入可能是普通值不是 Promise' },
      { type: 'info', text: '══ instanceof ══' },
      { type: 'log',  text: 'a instanceof B → a 的原型链上能不能找到 B.prototype' },
      { type: 'info', text: '── 实现 ──' },
      { type: 'code', text: 'function myInstanceof(obj, constructor) {' },
      { type: 'code', text: '  if (obj === null || typeof obj !== "object") return false' },
      { type: 'code', text: '  let proto = Object.getPrototypeOf(obj)  // 用标准方法不用__proto__' },
      { type: 'code', text: '  while (proto !== null) {' },
      { type: 'code', text: '    if (proto === constructor.prototype) return true' },
      { type: 'code', text: '    proto = Object.getPrototypeOf(proto)  // 沿原型链往上找' },
      { type: 'code', text: '  }' },
      { type: 'code', text: '  return false' },
      { type: 'code', text: '}' },
      { type: 'pass', text: 'Object.getPrototypeOf 是标准方法, __proto__ 非标准但浏览器都支持' },
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
      { type: 'info', text: '── template ──' },
      { type: 'log',  text: 'hash:    Map/Set for O(1) lookup, space trades time' },
      { type: 'log',  text: 'pointer: for(fast) + slow tracks position, check boundary!' },
      { type: 'log',  text: 'window:  right expand, condition fail → left shrink, update answer' },
    ]
  },

  weak: {
    title: 'Known Issues - Bug Tracker',
    content: [
      { type: 'err',  text: 'ISSUE-001: loop boundary off-by-one (3 occurrences in 7 days)' },
      { type: 'log',  text: '  #283: s2++ before if → skipped index 0' },
      { type: 'log',  text: '  #11:  left++ written as left--' },
      { type: 'log',  text: '  #3:   while <= should be <' },
      { type: 'warn', text: 'ACTION: always use for loop, check condition < vs <=, check ++ vs --' },
      { type: 'info', text: '' },
      { type: 'err',  text: 'ISSUE-002: Promise then() execution timing (Day 3)' },
      { type: 'log',  text: '  fulfilled state: should execute immediately, not push to callbacks' },
      { type: 'log',  text: '  pending state: push arrow fn () => onFulfilled(value), not onFulfilled()' },
      { type: 'warn', text: 'ACTION: ask "is result ready?" → yes: run now | no: store for later' },
      { type: 'info', text: '' },
      { type: 'err',  text: 'ISSUE-003: wrong data structure choice (#438, #3)' },
      { type: 'log',  text: '  #438: used Set instead of count array (misunderstood problem)' },
      { type: 'log',  text: '  #3:   used array+includes instead of Set' },
      { type: 'warn', text: 'ACTION: read problem twice, pick structure AFTER understanding' },
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
  '0320': { day: 'Day 1', tasks: ['EVT-LOOP runtime quiz', 'TASK-1 twoSum'], suites: ['event', 'algo'] },
  '0321': { day: 'Day 2', tasks: ['EVT-LOOP retry case 3,4', 'TASK-49 groupAnagrams'], suites: ['event', 'algo'] },
  '0322': { day: 'Day 3', tasks: ['PROMISE-IMPL phase 1-2', 'TASK-128 longestSeq', 'PROMISE-IMPL full build'], suites: ['promise', 'algo'] },
  '0323': { day: 'Day 4', tasks: ['PROMISE-IMPL retro', 'TASK-283 moveZeroes'], suites: ['promise', 'algo', 'weak'] },
  '0324': { day: 'Day 5', tasks: ['TASK-283 retry for-loop', 'TASK-11 maxArea'], suites: ['algo', 'weak'] },
  '0325': { day: 'Day 6', tasks: ['TASK-11 retro', 'TASK-3 longestSubstring'], suites: ['algo'] },
  '0326': { day: 'Day 7', tasks: ['TASK-3 retro window template', 'TASK-438 findAnagrams'], suites: ['algo'] },
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
  '0329': { day: 'Day 10', tasks: ['regression: pointer fixtures', 'regression: PROMISE-IMPL', 'review backlog'], suites: ['weak', 'promise', 'algo'] },
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
