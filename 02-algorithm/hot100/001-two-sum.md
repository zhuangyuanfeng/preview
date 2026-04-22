# 1. 两数之和（Easy）

## 题目

给定一个整数数组 `nums` 和一个整数目标值 `target`，找出数组中和为目标值的两个数的**下标**。

假设每种输入只会对应一个答案，且同一个元素不能重复使用。

```
输入：nums = [2, 7, 11, 15], target = 9
输出：[0, 1]
解释：nums[0] + nums[1] = 2 + 7 = 9
```

## 思路分析

### 暴力法（先理解题意）

两层循环，每对数字都试一遍。时间 O(n²)，能过但面试不够。

```javascript
function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j]
      }
    }
  }
}
```

### 哈希表法（面试要求）

**核心思路：** 遍历数组，对于每个数 `nums[i]`，看 `target - nums[i]` 之前是否出现过。

- 用 Map 存已遍历的数：`{ 值: 下标 }`
- 每次查 `target - nums[i]` 在不在 Map 里
- 在 → 找到了，返回
- 不在 → 把当前数存进 Map，继续

```javascript
function twoSum(nums, target) {
  const map = new Map()
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    if (map.has(complement)) {
      return [map.get(complement), i]
    }
    map.set(nums[i], i)
  }
}
```

时间 O(n)，空间 O(n)。

## 为什么用 Map 而不是对象

- Map 的 key 可以是任意类型（数字不会被转成字符串）
- `map.has()` 语义更清晰
- 面试时用 Map 更专业

## 这题的套路价值

**「用空间换时间 + 哈希表加速查找」** 是非常通用的模式，后面很多题都用到：

- 字母异位词分组（用哈希表分组）
- 最长连续序列（用 Set 判断存在性）
- 无重复字符的最长子串（用 Map 记录位置）

## 今晚练习要求

1. 看完思路后**关掉这个文件**
2. 打开 LeetCode，自己手写哈希表解法
3. 目标：5 分钟内写完并 AC
