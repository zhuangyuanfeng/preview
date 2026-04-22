/**
 * Day 13 - 2026.04.01
 * Task 1: trap (#42 Trapping Rain Water)
 *   - Implement BOTH: precompute version AND two-pointer version
 *
 * Run: node homework/0401.js
 */

// ═══════════════════════════════════════════
// Task 1a: trap - precompute version
// Requirement:
//   - Build leftMax[] and rightMax[] arrays
//   - water[i] = min(leftMax[i], rightMax[i]) - height[i]
//   - Time O(n), Space O(n)
//   - Time limit: 10min
// ═══════════════════════════════════════════

function trapPrecompute(height) {
  // YOUR CODE HERE
}

// ═══════════════════════════════════════════
// Task 1b: trap - two pointer version
// Requirement:
//   - Left/right pointers, move shorter side
//   - Track leftMax and rightMax
//   - Time O(n), Space O(1)
//   - Time limit: 12min
// ═══════════════════════════════════════════

function trapTwoPointer(height) {
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

console.log('\n\x1b[1m[Test Suite] Day 13 - Trapping Rain Water\x1b[0m')
console.log('\x1b[2m' + '─'.repeat(50) + '\x1b[0m')

const cases = [
  { input: [0,1,0,2,1,0,1,3,2,1,2,1], expected: 6, name: 'example 1' },
  { input: [4,2,0,3,2,5], expected: 9, name: 'example 2' },
  { input: [1,2,3,4,5], expected: 0, name: 'ascending (no water)' },
  { input: [5,4,3,2,1], expected: 0, name: 'descending (no water)' },
  { input: [3,0,3], expected: 3, name: 'simple valley' },
  { input: [], expected: 0, name: 'empty array' },
]

console.log('\n  \x1b[36mtrapPrecompute:\x1b[0m')
for (const c of cases) {
  try {
    const r = trapPrecompute(c.input)
    assert(r === c.expected, `${c.name}: ${r} === ${c.expected}`)
  } catch (e) {
    console.log(`  \x1b[31m✗ ${c.name}: ${e.message}\x1b[0m`)
    failed++
  }
}

console.log('\n  \x1b[36mtrapTwoPointer:\x1b[0m')
for (const c of cases) {
  try {
    const r = trapTwoPointer(c.input)
    assert(r === c.expected, `${c.name}: ${r} === ${c.expected}`)
  } catch (e) {
    console.log(`  \x1b[31m✗ ${c.name}: ${e.message}\x1b[0m`)
    failed++
  }
}

// Summary
console.log('\n\x1b[2m' + '─'.repeat(50) + '\x1b[0m')
console.log(`  \x1b[32m${passed} passed\x1b[0m  \x1b[31m${failed} failed\x1b[0m`)
if (failed === 0) console.log('  \x1b[32m\x1b[1mAll tests passed!\x1b[0m')
console.log()
