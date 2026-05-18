# 事件循环（Event Loop）

## 口诀

**"同步先跑完 → 微任务全清 → 宏任务取一个 → 再清微任务"**

简写版：**同 → 微(全) → 宏(1) → 微(全) → 宏(1) → ...**

## 谁是微任务、谁是宏任务

| 微任务（插队 VIP） | 宏任务（排队普通人） |
|---|---|
| Promise.then/catch/finally | setTimeout / setInterval |
| async/await 后面的代码 | DOM 事件回调（click 等） |
| MutationObserver | 网络请求回调 |
| queueMicrotask() | I/O |

## 易错点

### 1. 宏任务里产生的微任务，当轮就清
```javascript
setTimeout(() => {
  console.log('B')           // 宏任务
  Promise.resolve().then(() => {
    console.log('C')         // 这个微任务在 B 之后、下一个宏任务之前执行
  })
}, 0)
```
B 执行完 → 调用栈空 → 立刻清微任务 → C → 然后才取下一个宏任务

### 2. 微任务里产生的宏任务，要排到最后
```javascript
Promise.resolve().then(() => {
  console.log('D')
  setTimeout(() => {
    console.log('E')         // 排到宏任务队列最后面
  }, 0)
})
```

### 3. async/await 的拆解
```javascript
async function foo() {
  console.log('1')          // 同步，立刻执行
  await bar()               // bar() 同步执行，但 await 后面的代码变成微任务
  console.log('2')          // 微任务
}
```
`await` 后面的代码 = `Promise.then` 里的代码
