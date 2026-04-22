/**
 * Day 9 - 2026.03.28
 * Task 1: threeSum (#15)
 * Task 2: myCall
 * Task 3: myBind
 *
 * Run: node homework/0328.js
 */

// ═══════════════════════════════════════════
// Task 1: threeSum
// Requirement:
//   - Find all unique triplets that sum to 0
//   - Sort + two pointer approach
//   - Handle deduplication for i, left, right
//   - Time limit: 15min
// ═══════════════════════════════════════════

function threeSum(nums) {
  // 先从小到大排序
  nums = nums.sort((a, b) => a - b);
  let s = 0; //固定位
  let sl = 1;
  let sr = nums.length - 1;
  let result = [];
  let _set = new Set([]);
  while (s < nums.length) {
    if (s == nums.length - 2) break;
    let cur = nums[s] + nums[sl] + nums[sr];
    if (!cur) {
      if (!_set.has(`${nums[s]}-${nums[sl]}-${nums[sr]}`)) {
        result.push([nums[s], nums[sl], nums[sr]]);
        _set.add(`${nums[s]}-${nums[sl]}-${nums[sr]}`);
      }
    }
    if (sl + 1 == sr) {
      s++;
      sl = s + 1;
      sr = nums.length - 1;
      continue;
    }
    if (cur > 0) {
      sr--;
    } else {
      sl++;
    }
  }
  return result;
}

// ═══════════════════════════════════════════
// Task 2: myCall
// Requirement:
//   - Change `this` context
//   - Use Symbol as temp key
//   - Pass arguments one by one
//   - Time limit: 5min
// ═══════════════════════════════════════════

Function.prototype.myCall = function (context, ...args) {
  // YOUR CODE HERE
};

// ═══════════════════════════════════════════
// Task 3: myBind
// Requirement:
//   - Return a new function (not execute immediately)
//   - Support partial application (currying-like)
//   - Time limit: 8min
// ═══════════════════════════════════════════

Function.prototype.myBind = function (context, ...args) {
  // YOUR CODE HERE
};

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

console.log("\n\x1b[1m[Test Suite] Day 9 - threeSum / myCall / myBind\x1b[0m");
console.log("\x1b[2m" + "─".repeat(50) + "\x1b[0m");

// threeSum tests
console.log("\n  \x1b[36mthreeSum:\x1b[0m");
try {
  const r1 = threeSum([-1, 0, 1, 2, -1, -4]);
  const s1 = r1.map((t) => t.sort((a, b) => a - b).join(",")).sort();
  assert(s1.length === 2, "example: returns 2 triplets");
  assert(s1.includes("-1,-1,2"), "example: contains [-1,-1,2]");
  assert(s1.includes("-1,0,1"), "example: contains [-1,0,1]");

  const r2 = threeSum([0, 0, 0, 0]);
  assert(r2.length === 1, "all zeros: returns 1 triplet");
  assert(r2[0].join(",") === "0,0,0", "all zeros: [0,0,0]");

  const r3 = threeSum([1, 2, 3]);
  assert(r3.length === 0, "no solution: returns empty");
} catch (e) {
  console.log(`  \x1b[31m✗ threeSum error: ${e.message}\x1b[0m`);
  failed++;
}

// myCall tests
console.log("\n  \x1b[36mmyCall:\x1b[0m");
try {
  const obj = { name: "test" };
  function greet(greeting, punctuation) {
    return greeting + ", " + this.name + punctuation;
  }
  const r = greet.myCall(obj, "Hello", "!");
  assert(r === "Hello, test!", "correct this binding and args");

  function getThis() {
    return this;
  }
  const r2 = getThis.myCall({ x: 1 });
  assert(r2.x === 1, "returns correct context");
} catch (e) {
  console.log(`  \x1b[31m✗ myCall error: ${e.message}\x1b[0m`);
  failed++;
}

// myBind tests
console.log("\n  \x1b[36mmyBind:\x1b[0m");
try {
  const obj = { name: "test" };
  function greet(greeting, punctuation) {
    return greeting + ", " + this.name + punctuation;
  }
  const bound = greet.myBind(obj, "Hey");
  assert(typeof bound === "function", "returns a function");
  const r = bound("~");
  assert(r === "Hey, test~", "partial application works");

  const bound2 = greet.myBind(obj);
  assert(bound2("Hi", ".") === "Hi, test.", "all args at call time works");
} catch (e) {
  console.log(`  \x1b[31m✗ myBind error: ${e.message}\x1b[0m`);
  failed++;
}

// Summary
console.log("\n\x1b[2m" + "─".repeat(50) + "\x1b[0m");
console.log(
  `  \x1b[32m${passed} passed\x1b[0m  \x1b[31m${failed} failed\x1b[0m`,
);
if (failed === 0) console.log("  \x1b[32m\x1b[1mAll tests passed!\x1b[0m");
console.log();
