---
name: study-wrap
description: 当天真正结束学习。自动总结进度、更新 handoff.md、累加 tracker.json、做微复盘、提示同步。⚠️ 这是「当天结束」，会累加学习日 + 触发倦怠预警。如果只是切机但没结束，请用 /study-sync。如果是新一天的开始，请用 /study-start。触发关键词：今天结束 / 收工 / 今天就到这 / 准备睡了 / 明天再来 / 学完了 / wrap / study-wrap。
---

# 结束今天学习（study-wrap）

**核心语义**：当天**真正结束**学习。会累加学习数据 + 做复盘。

**与其他 skill 的边界**：

| Skill | 用法 |
|---|---|
| `/study-wrap`（本 skill）| 当天真正结束，累加 tracker，做复盘 |
| `/study-sync` | 切机但**没结束**，只是临时离开 |
| `/study-context` | 中途从另一台电脑/几小时前继承上下文 |
| `/study-start` | 新一天的开始仪式 |

如果用户语境是"切机但没结束"（比如"我先去吃饭" / "换电脑"），**主动建议改用 `/study-sync`**。

调用此 skill 在 2-3 分钟内完成今天的收工流程。

## 步骤 1：从对话中提取今天做了什么

回顾本次 session 中用户做的实质工作，结构化整理：

- ✅ **算法题完成**：题号 + 题名 + 卡壳点（如有）
- ✅ **手写题完成**：如 instanceof / 数组扁平化
- ✅ **Demo / 视觉产出**：图、demo 文件、笔记
- ✅ **痛点池更新**：填了几个 / 解了哪个
- ⚠️ **卡壳 / 未完成**：明天要补的
- 💭 **微复盘 3 问**（如果用户没说，主动一题一问）：
  1. 启动仪式好用吗？哪步多余/缺什么？
  2. 心流进了吗？卡了多久？
  3. 想明天继续吗？

如果用户只说"收工"，先问："今天主要做了哪几项？" 再继续。

## 步骤 2：用 Write 重写 ~/preview/handoff.md

按 handoff 现有结构更新（保留 9 节标题），变化的字段：

- **Last Updated**: 今天日期 YYYY-MM-DD
- **What I Was Doing**: 一句话总结今天
- **Current Progress**: 累加更新累计数据
  - 算法 Hot 100：原数 + 今天新做数
  - JS 手写题：累计完成 / 9
  - PAIN-POINTS：填了几个 / 10
  - 其他模块进度
- **Next Steps**: 删掉今天已完成的项，加上明天/后天的项
- **Open Issues**: 如有卡壳点 / 未决项，加进来

不要扩写超过 handoff 原本篇幅。

## 步骤 3：更新 ~/preview/data/tracker.json（如有学习产出）

如果今天做了算法 / 手写题 / 完成了某个 demo：

用 Edit 工具追加 `records.{今天日期}` 条目，参考已有结构：

```json
"2026-04-27": {
  "day": "Day N",
  "done": true,
  "time": "01:00",
  "tasks": {
    "0": { "done": true, "note": "Hot 100 #21 合并两有序链表，xxx" },
    "1": { "done": true, "note": "Hot 100 #141 环形链表，快慢指针，xxx" }
  },
  "weakness": ["xxx"]   // 如有卡壳点
}
```

同步更新 `stats`：
- `algoCompleted` 数组：push 新题号
- `totalStudyDays`: +1
- `currentStreak`: +1（如果昨天也学了；否则重置为 1）
- `maxStreak`: max(currentStreak, maxStreak)

如果今天没做学习产出（纯填 PAIN-POINTS / 改文档），跳过 tracker.json。

## 步骤 4：自动 commit + push（无需用户操作）

handoff.md 和 tracker.json 改完后，立即用 Bash 一气呵成执行：

```bash
cd ~/preview
# 收集本次改动
git add handoff.md data/tracker.json

# 如果都没变化，跳过
if git diff --cached --quiet; then
  echo "本次收工没有文件变化，跳过 commit"
else
  git commit -m "wrap: <Claude 自动生成，例如：wrap: Day 1 完成 #21 #141，明天 Day 2 继续 #142>"
  git push origin master
fi
```

**commit message 由 Claude 基于步骤 1 的总结自动生成**，格式 `wrap: Day N 完成 xxx，明天 Day M xxx`。

### 如果失败（网络/冲突/凭据）

- 立即报告错误原因
- **不要自动重试**
- 给用户清晰的手动恢复指引（例如：`git pull --rebase` 解冲突 / 检查网络）
- 提示用户：handoff 和 tracker 已经写好，只需手动 push 就行

## 步骤 5：给用户一份收工卡（≤ 10 行）

成功格式（直接输出，不要外面套）：

```
🌙 今日收工

✅ 完成
  - [2-3 项要点]
⚠️ 卡壳
  - [如有，最多 2 项；没有就不要这一行]
💭 微复盘
  - 启动仪式：[简短]
  - 心流：[简短]
  - 想继续：[Yes/No 或简短]

📦 已更新：handoff.md / tracker.json
☁️ 已推送：commit <短 hash>

晚安，明天 /study-start 开学。
```

失败格式：

```
❌ 推送失败：<错误原因>
- handoff 和 tracker 已写好（本地）
- 建议操作：<具体命令>
- 修复后告诉我，我重试
```

## ❌ 不要做的事

- 不要写超过 10 行的总结
- 不要在收工时教育 / 批评用户（即使没完成里程碑）
- ❌ 不要让用户手动跑 ./sync.sh out 或 git 命令（你调用此 skill 已授权 Claude 自动 push）
- 不要建议"明天加倍补回来"（违反节奏，触发倦怠）
- 不要在 handoff 写虚假进度（用户没做的事不要写"完成"）

## 周日特殊处理

如果今天是**周日**（用 Bash 跑 `date +%u` 等于 7），收工流程额外提醒：

```
🎤 今天周日，建议额外做：
1. 录音 5 分钟"自己讲一遍"本周核心概念（不看资料）
2. 按 ASSESSMENT.md 写第 X 周复盘
3. 评估 5 个预警信号 → 调整下周里程碑

要不要现在就做？还是明天早上做？
```

不强制做，让用户决定。

## 第 5-7 周（5.26-6.15）特殊提醒

如果今天日期落在 5.26-6.15 之间（用户的兴趣型驱动倦怠高发期），收工卡末尾追加：

```
💡 现在是倦怠高发期。如果今天有点懒/没动力，
   别硬扛——明天先做一个 PAIN-POINTS 痛点项目，
   重新点燃兴趣。
```

## 主动触发场景

新 session 中用户说以下任一，主动调用此 skill：

- "今天就到这"
- "收工"
- "结束今天"
- "我准备睡了"
- "明天再来"
- "我累了"
- "/study-wrap"
- "/wrap"

## 何时拒绝调用

如果今天**完全没做实质学习**（用户从开始到现在只在闲聊 / 看文档），拒绝走完整收工流程。
回应一句：

> 今天好像没做实质学习内容，handoff 不需要更新。
> 要不要现在还能挤 30 分钟，做 1 题算法再收工？
