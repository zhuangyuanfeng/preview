/**
 * Day 14 - 2026.04.02
 * Task 1: reverseList (#206 Reverse Linked List)
 *   - Implement iterative version
 *   - Bonus: recursive version
 *
 * Run: node homework/0402.js
 */

// Linked list node
class ListNode {
  constructor(val, next = null) {
    this.val = val
    this.next = next
  }
}

// Helper: array → linked list
function toList(arr) {
  if (!arr.length) return null
  const head = new ListNode(arr[0])
  let curr = head
  for (let i = 1; i < arr.length; i++) {
    curr.next = new ListNode(arr[i])
    curr = curr.next
  }
  return head
}

// Helper: linked list → array
function toArray(head) {
  const arr = []
  while (head) {
    arr.push(head.val)
    head = head.next
  }
  return arr
}

// ═══════════════════════════════════════════
// Task 1: reverseList (iterative)
// Requirement:
//   - Use prev / curr / next three pointers
//   - In-place reversal, O(1) space
//   - Time limit: 5min
// ═══════════════════════════════════════════

function reverseList(head) {
  // YOUR CODE HERE
}

// ═══════════════════════════════════════════
// Bonus: reverseList (recursive)
// Requirement:
//   - Understand head.next.next = head
//   - Time limit: understand it, not required to write from scratch
// ═══════════════════════════════════════════

function reverseListRecursive(head) {
  // YOUR CODE HERE (optional)
}

// ═══════════════════════════════════════════
// Tests - DO NOT MODIFY BELOW
// ═══════════════════════════════════════════

let passed = 0
let failed = 0

function assert(condition, msg) {
  if (condition) {
    console.log(`  \x1b[32m✓\x1b[0m ${msg}`)
    passed++
  } else {
    console.log(`  \x1b[31m✗\x1b[0m ${msg}`)
    failed++
  }
}

console.log('\n\x1b[1m[Test Suite] Day 14 - Reverse Linked List\x1b[0m')
console.log('\x1b[2m' + '─'.repeat(50) + '\x1b[0m')

// iterative tests
console.log('\n  \x1b[36mreverseList (iterative):\x1b[0m')
try {
  const r1 = toArray(reverseList(toList([1, 2, 3, 4, 5])))
  assert(JSON.stringify(r1) === '[5,4,3,2,1]', '[1,2,3,4,5] → [5,4,3,2,1]')

  const r2 = toArray(reverseList(toList([1, 2])))
  assert(JSON.stringify(r2) === '[2,1]', '[1,2] → [2,1]')

  const r3 = reverseList(toList([]))
  assert(r3 === null, '[] → null')

  const r4 = toArray(reverseList(toList([42])))
  assert(JSON.stringify(r4) === '[42]', '[42] → [42]')
} catch (e) {
  console.log(`  \x1b[31m✗ reverseList error: ${e.message}\x1b[0m`)
  failed++
}

// recursive tests (bonus)
console.log('\n  \x1b[36mreverseList (recursive, bonus):\x1b[0m')
try {
  const r1 = reverseListRecursive(toList([1, 2, 3, 4, 5]))
  if (r1 === undefined || r1 === null && toList([1,2,3,4,5]) !== null) {
    console.log('  \x1b[33m⚠ not implemented (optional)\x1b[0m')
  } else {
    const arr = toArray(r1)
    assert(JSON.stringify(arr) === '[5,4,3,2,1]', '[1,2,3,4,5] → [5,4,3,2,1]')
  }
} catch (e) {
  console.log(`  \x1b[33m⚠ recursive not implemented or has error (optional)\x1b[0m`)
}

// Summary
console.log('\n\x1b[2m' + '─'.repeat(50) + '\x1b[0m')
console.log(`  \x1b[32m${passed} passed\x1b[0m  \x1b[31m${failed} failed\x1b[0m`)
if (failed === 0) console.log('  \x1b[32m\x1b[1mAll tests passed!\x1b[0m')
console.log()
