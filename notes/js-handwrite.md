# JS 手写题

## instanceof

### 口诀
**沿原型链往上爬，碰到 prototype 就 true，碰到 null 就 false**

### 代码
```javascript
function myInstanceof(obj, Constructor) {
  if (obj === null || typeof obj !== 'object') return false
  if (Object.getPrototypeOf(obj) === Constructor.prototype) return true
  return myInstanceof(Object.getPrototypeOf(obj), Constructor)
}
```

### 易错点
- 用 `Object.getPrototypeOf(obj)` 不用 `__proto__`（非标准）
- 用 `===` 不用 `==`
- 先判 null 和基本类型

---

## 数组扁平化

### 口诀
**遍历数组，是数组就递归拍平拼进来，不是就直接放**

### 代码
```javascript
function flatten(arr) {
  let result = []
  for (const item of arr) {
    if (Array.isArray(item)) {
      result = [...result, ...flatten(item)]
    } else {
      result = [...result, item]
    }
  }
  return result   // 别忘了 return！
}
```

### 易错点
- `for...of` 要声明 `const`，否则 item 变全局变量
- 别忘了 `return result`
