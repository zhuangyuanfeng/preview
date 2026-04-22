/**
 * Day 8 - 2026.03.27
 * Task 1: deepClone (WeakMap version)
 * Task 2: debounce (basic)
 * Task 3: throttle (timestamp version)
 *
 * Run: node homework/0327.js
 */

// ═══════════════════════════════════════════
// Task 1: deepClone
// Requirement:
//   - Handle basic types (number, string, boolean, null, undefined)
//   - Handle object and array recursively
//   - Handle circular reference with WeakMap
//   - Time limit: 15min
// ═══════════════════════════════════════════

function deepClone(obj, map = new WeakMap()) {
  if (!obj || typeof obj != "object") return obj;
  if (map.has(obj)) return map.get(obj);
  // 这里可以加其他特殊类型的if，这里我省略了
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  let clone = Array.isArray(obj) ? [] : {};

  map.set(obj, clone);
  for (let key in obj) {
    if (typeof obj == "object") {
      clone[key] = deepClone(obj[key], map);
    } else {
      clone[key] = obj[key];
    }
  }
  return clone;
}

// ═══════════════════════════════════════════
// Task 2: debounce
// Requirement:
//   - Return a debounced function
//   - clearTimeout + setTimeout pattern
//   - Preserve `this` and arguments
//   - Time limit: 10min
// ═══════════════════════════════════════════

function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      clearTimeout(timer);
    }, delay);
  };
}

// ═══════════════════════════════════════════
// Task 3: throttle (timestamp version)
// Requirement:
//   - Return a throttled function
//   - Use Date.now() comparison
//   - First call executes immediately
//   - Time limit: 8min
// ═══════════════════════════════════════════

function throttle(fn, delay) {
  let lastTime = 0;
  return function (...args) {
    let now = Date.now();
    if (now - lastTime < delay) return;
    fn.apply(this, args);
    lastTime = now;
  };
}

// ═══════════════════════════════════════════
// Tests - DO NOT MODIFY BELOW
// ═══════════════════════════════════════════

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
    passed++;
  } else {
    console.log(`  \x1b[31m✗\x1b[0m ${msg}`);
    failed++;
  }
}

console.log(
  "\n\x1b[1m[Test Suite] Day 8 - deepClone / debounce / throttle\x1b[0m",
);
console.log("\x1b[2m" + "─".repeat(50) + "\x1b[0m");

// deepClone tests
console.log("\n  \x1b[36mdeepClone:\x1b[0m");
try {
  const obj1 = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
  const clone1 = deepClone(obj1);
  assert(clone1.a === 1, "basic value copy");
  assert(clone1.b !== obj1.b, "nested object is new reference");
  assert(clone1.b.c === 2, "nested value preserved");
  assert(clone1.d !== obj1.d, "array is new reference");
  assert(JSON.stringify(clone1.d) === "[1,2,3]", "array values preserved");

  clone1.b.c = 999;
  assert(obj1.b.c === 2, "modifying clone does not affect original");

  const circular = { name: "test" };
  circular.self = circular;
  const cloneCirc = deepClone(circular);
  assert(cloneCirc.name === "test", "circular: value preserved");
  assert(cloneCirc.self === cloneCirc, "circular: self reference works");
  assert(cloneCirc.self !== circular, "circular: new reference");
} catch (e) {
  console.log(`  \x1b[31m✗ deepClone error: ${e.message}\x1b[0m`);
  failed++;
}

// debounce tests
console.log("\n  \x1b[36mdebounce:\x1b[0m");
try {
  let count = 0;
  const fn = debounce(() => count++, 100);
  assert(typeof fn === "function", "returns a function");
  fn();
  fn();
  fn();
  assert(count === 0, "not called immediately after 3 triggers");
  await new Promise((r) => setTimeout(r, 150));
  assert(count === 1, "called once after delay");
} catch (e) {
  console.log(`  \x1b[31m✗ debounce error: ${e.message}\x1b[0m`);
  failed++;
}

// throttle tests
console.log("\n  \x1b[36mthrottle:\x1b[0m");
try {
  let count = 0;
  const fn = throttle(() => count++, 100);
  assert(typeof fn === "function", "returns a function");
  fn();
  assert(count === 1, "first call executes immediately");
  fn();
  fn();
  assert(count === 1, "subsequent calls within delay are ignored");
  await new Promise((r) => setTimeout(r, 150));
  fn();
  assert(count === 2, "call after delay executes");
} catch (e) {
  console.log(`  \x1b[31m✗ throttle error: ${e.message}\x1b[0m`);
  failed++;
}

// Summary
console.log("\n\x1b[2m" + "─".repeat(50) + "\x1b[0m");
console.log(
  `  \x1b[32m${passed} passed\x1b[0m  \x1b[31m${failed} failed\x1b[0m`,
);
if (failed === 0) console.log("  \x1b[32m\x1b[1mAll tests passed!\x1b[0m");
console.log();
