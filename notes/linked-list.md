# 链表

## 口诀

- **`.val` 比大小，`.next` 走路**
- **dummy 是书签夹在第 0 页不动，curr 是你的手一直翻到最后一页**
- **`l1 = xxx` 换标签不影响别人，`l1.xxx = yyy` 改对象本身所有人受影响**

## 易错点

### 1. 属性名是 val 不是 value
LeetCode 的 ListNode 用的是 `val`，不是 `value`。

### 2. dummy 初始化
```javascript
const dummy = new ListNode(0)   // 单个节点，val 随便填
let curr = dummy                 // 两个变量指向同一个节点
// ❌ curr = dummy.next          // 一开始 dummy.next 是 null，没法接东西
```

### 3. 环形链表比的是引用不是值
```javascript
// ❌ slow.value == fast.value   // 不同节点可能值相同
// ✅ slow === fast              // 同一个对象才算有环
```

### 4. 合并链表别忘接剩余
```javascript
// while 结束后
curr.next = l1 || l2    // 哪边还有剩的直接整段接上
```

## 核心模板

### 合并两个有序链表（#21）
```javascript
function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0)
  let curr = dummy
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      curr.next = l1
      l1 = l1.next
    } else {
      curr.next = l2
      l2 = l2.next
    }
    curr = curr.next
  }
  curr.next = l1 || l2
  return dummy.next
}
```

### 环形链表（#141）
```javascript
function hasCycle(head) {
  let slow = head
  let fast = head
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) return true
  }
  return false
}
```

### 环形链表 II — 找入口（#142）
```javascript
function detectCycle(head) {
  let slow = head
  let fast = head
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) {
      slow = head              // 拉回起点
      while (slow !== fast) {  // 先比再走！不然可能死循环
        slow = slow.next
        fast = fast.next       // 同速走
      }
      return slow              // 再次相遇 = 入口
    }
  }
  return null
}
```
口诀：**快慢相遇后，一个回头一个留，同速走再遇就是入口**

易错点：第 2 步必须**先比再走**，否则入口刚好在 head 时死循环

### 删除链表倒数第 N 个节点（#19）
```javascript
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0)
  dummy.next = head
  let slow = dummy
  let fast = dummy
  for (let i = 0; i < n; i++) {
    fast = fast.next
  }
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next
  }
  slow.next = slow.next.next   // 一行删除，不需要 if/else
  return dummy.next
}
```
口诀：**fast 先走 n 步，然后同速走，fast 到尾时 slow 在目标前一个**

易错点：
- 必须用 dummy，否则删头节点出错
- 删除就是 `slow.next = slow.next.next`，一行搞定，null 也没问题
- `slow.next` 是要删的节点本身，不是"越过了"

### 相交链表（#160）
```javascript
function getIntersectionNode(headA, headB) {
  let a = headA
  let b = headB
  while (a !== b) {
    a = a ? a.next : headB
    b = b ? b.next : headA
  }
  return a
}
```
口诀：**A 走完跳 B，B 走完跳 A，走相同总距离必在交点相遇**

易错点：
- 不要真拼链表（会破坏原始数据+可能死循环），逻辑切换就行
- `a = a ? a.next : headB` 不是 `a = a.next || headB`（a 是 null 时 a.next 报错）
