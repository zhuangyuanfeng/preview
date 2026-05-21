# 栈

## 有效括号（#20）

### 口诀
**左括号入栈，右括号看栈顶配不配，最后栈空就 true**

### 代码
```javascript
function isValid(s) {
  const map = { ')': '(', ']': '[', '}': '{' }
  const stack = []
  for (const ch of s) {
    if (!map[ch]) {
      stack.push(ch)        // 左括号入栈
    } else if (stack[stack.length - 1] === map[ch]) {
      stack.pop()            // 配对，弹出
    } else {
      return false           // 不配对
    }
  }
  return stack.length === 0
}
```

### 易错点
- 对象取值用 `obj[key]` 不是 `obj(key)`
- `list.length` 不是 `list.len`

---

## 最小栈（#155）

### 口诀
**两个栈同步：主栈存数据，辅助栈存"到这一层为止的最小值"**

### 代码
```javascript
class MinStack {
  constructor() {
    this.stack = []
    this.minStack = []
  }
  push(val) {
    this.stack.push(val)
    const curMin = this.minStack.length
      ? Math.min(val, this.minStack[this.minStack.length - 1])
      : val
    this.minStack.push(curMin)
  }
  pop() {
    this.stack.pop()
    this.minStack.pop()      // 永远同步弹
  }
  top() {
    return this.stack[this.stack.length - 1]
  }
  getMin() {
    return this.minStack[this.minStack.length - 1]
  }
}
```

### 易错点
- 单变量 min 不行 — pop 后无法回退到之前的最小值
- 辅助栈和主栈一一对应，pop 时永远同步弹，不需要判断
- 第一次 push 时辅助栈是空的，要特判（用 val 本身）
- 辅助栈不是排序栈，不需要插入中间
