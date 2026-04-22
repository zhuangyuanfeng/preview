/**
 * Day 11 - 2026.03.30
 * Task 1: curry
 * Task 2: EventEmitter (on/off/emit/once)
 *
 * Run: node homework/0330.js
 */

// ═══════════════════════════════════════════
// Task 1: curry
// Requirement:
//   - curry(fn)(1)(2)(3) === fn(1,2,3)
//   - curry(fn)(1,2)(3) also works
//   - Use fn.length to check if args enough
//   - Time limit: 8min
// ═══════════════════════════════════════════

function curry(fn) {
  // YOUR CODE HERE
}

// ═══════════════════════════════════════════
// Task 2: EventEmitter
// Requirement:
//   - on(event, fn): subscribe
//   - off(event, fn): unsubscribe
//   - emit(event, ...args): publish
//   - once(event, fn): subscribe once then auto-unsubscribe
//   - Time limit: 10min
// ═══════════════════════════════════════════

class EventEmitter {
  // YOUR CODE HERE
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

console.log('\n\x1b[1m[Test Suite] Day 11 - curry / EventEmitter\x1b[0m')
console.log('\x1b[2m' + '─'.repeat(50) + '\x1b[0m')

// curry tests
console.log('\n  \x1b[36mcurry:\x1b[0m')
try {
  const add = (a, b, c) => a + b + c
  const curried = curry(add)
  assert(curried(1)(2)(3) === 6, 'curry(add)(1)(2)(3) === 6')
  assert(curried(1, 2)(3) === 6, 'curry(add)(1,2)(3) === 6')
  assert(curried(1)(2, 3) === 6, 'curry(add)(1)(2,3) === 6')
  assert(curried(1, 2, 3) === 6, 'curry(add)(1,2,3) === 6')

  const mul = (a, b) => a * b
  const curriedMul = curry(mul)
  assert(curriedMul(3)(4) === 12, 'curry(mul)(3)(4) === 12')
} catch (e) {
  console.log(`  \x1b[31m✗ curry error: ${e.message}\x1b[0m`)
  failed++
}

// EventEmitter tests
console.log('\n  \x1b[36mEventEmitter:\x1b[0m')
try {
  const emitter = new EventEmitter()
  let result = []

  const fn1 = (x) => result.push('fn1:' + x)
  const fn2 = (x) => result.push('fn2:' + x)

  emitter.on('test', fn1)
  emitter.on('test', fn2)
  emitter.emit('test', 'a')
  assert(result.join(',') === 'fn1:a,fn2:a', 'on + emit works')

  result = []
  emitter.off('test', fn1)
  emitter.emit('test', 'b')
  assert(result.join(',') === 'fn2:b', 'off removes specific listener')

  result = []
  const fn3 = (x) => result.push('fn3:' + x)
  emitter.once('once-test', fn3)
  emitter.emit('once-test', 'c')
  emitter.emit('once-test', 'd')
  assert(result.join(',') === 'fn3:c', 'once: only fires once')

  result = []
  emitter.emit('nonexistent', 'e')
  assert(result.length === 0, 'emit non-existent event does nothing')
} catch (e) {
  console.log(`  \x1b[31m✗ EventEmitter error: ${e.message}\x1b[0m`)
  failed++
}

// Summary
console.log('\n\x1b[2m' + '─'.repeat(50) + '\x1b[0m')
console.log(`  \x1b[32m${passed} passed\x1b[0m  \x1b[31m${failed} failed\x1b[0m`)
if (failed === 0) console.log('  \x1b[32m\x1b[1mAll tests passed!\x1b[0m')
console.log()
