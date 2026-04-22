/**
 * Day 12 - 2026.03.31
 * Task 1: promiseAll
 * Task 2: myInstanceof
 *
 * Run: node homework/0331.js
 */

// ═══════════════════════════════════════════
// Task 1: promiseAll
// Requirement:
//   - Accept array of promises (or values)
//   - Resolve when ALL resolve, with results in order
//   - Reject when ANY rejects
//   - Handle non-Promise values (wrap with Promise.resolve)
//   - Time limit: 10min
// ═══════════════════════════════════════════

function promiseAll(promises) {
  // YOUR CODE HERE
}

// ═══════════════════════════════════════════
// Task 2: myInstanceof
// Requirement:
//   - Check if obj's prototype chain contains constructor.prototype
//   - Use Object.getPrototypeOf (not __proto__)
//   - Handle null/non-object input
//   - Time limit: 5min
// ═══════════════════════════════════════════

function myInstanceof(obj, constructor) {
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

async function runTests() {
  console.log('\n\x1b[1m[Test Suite] Day 12 - promiseAll / myInstanceof\x1b[0m')
  console.log('\x1b[2m' + '─'.repeat(50) + '\x1b[0m')

  // promiseAll tests
  console.log('\n  \x1b[36mpromiseAll:\x1b[0m')
  try {
    const r1 = await promiseAll([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
    ])
    assert(JSON.stringify(r1) === '[1,2,3]', 'all resolve: [1,2,3]')

    const r2 = await promiseAll([
      new Promise(r => setTimeout(() => r('slow'), 100)),
      Promise.resolve('fast'),
      42,
    ])
    assert(r2[0] === 'slow', 'async: order preserved (slow first)')
    assert(r2[1] === 'fast', 'async: order preserved (fast second)')
    assert(r2[2] === 42, 'non-promise value handled')

    let rejected = false
    try {
      await promiseAll([
        Promise.resolve(1),
        Promise.reject('error'),
        Promise.resolve(3),
      ])
    } catch (e) {
      rejected = true
      assert(e === 'error', 'reject: receives rejection reason')
    }
    assert(rejected, 'reject: rejects when any promise rejects')
  } catch (e) {
    console.log(`  \x1b[31m✗ promiseAll error: ${e.message}\x1b[0m`)
    failed++
  }

  // myInstanceof tests
  console.log('\n  \x1b[36mmyInstanceof:\x1b[0m')
  try {
    assert(myInstanceof([], Array) === true, '[] instanceof Array')
    assert(myInstanceof([], Object) === true, '[] instanceof Object')
    assert(myInstanceof('str', String) === false, '"str" instanceof String (primitive)')
    assert(myInstanceof(null, Object) === false, 'null instanceof Object')
    assert(myInstanceof({}, Array) === false, '{} instanceof Array')

    class Animal {}
    class Dog extends Animal {}
    const dog = new Dog()
    assert(myInstanceof(dog, Dog) === true, 'dog instanceof Dog')
    assert(myInstanceof(dog, Animal) === true, 'dog instanceof Animal (inheritance)')
  } catch (e) {
    console.log(`  \x1b[31m✗ myInstanceof error: ${e.message}\x1b[0m`)
    failed++
  }

  // Summary
  console.log('\n\x1b[2m' + '─'.repeat(50) + '\x1b[0m')
  console.log(`  \x1b[32m${passed} passed\x1b[0m  \x1b[31m${failed} failed\x1b[0m`)
  if (failed === 0) console.log('  \x1b[32m\x1b[1mAll tests passed!\x1b[0m')
  console.log()
}

runTests()
