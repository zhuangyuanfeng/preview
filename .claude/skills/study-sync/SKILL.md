---
name: study-sync
description: 切机前同步——A 机要切走/中场休息/被打断时调用。把当前正在做的事写到 handoff.md，方便另一台电脑（或下次 session）用 /study-context 继承。⚠️ 这不是收工！不会累加 tracker、不会标记今日完成、不会触发倦怠预警。如果是当天真正结束，请改用 /study-wrap。触发关键词：要走了 / 切机 / 换电脑 / 我先离开一下 / 临时停一下 / sync / study-sync。
---

# 切机前同步（study-sync）

**核心语义**：临时离开当前电脑，但**不代表结束当天学习**。
只是把"现在正在做什么"快照到 handoff.md，让另一台电脑能继承。

**关键差异**（不要混淆）：

| Skill | 是否结束当天 | 是否累加 tracker | 是否触发倦怠预警 |
|---|---|---|---|
| `/study-sync`（本 skill）| ❌ 不结束 | ❌ 不累加 | ❌ 不触发 |
| `/study-wrap` | ✅ 结束当天 | ✅ 累加 | ✅ 触发 |

如果用户语境是"今天学完了" / "睡觉了" / "明天再来"，**主动建议改用 `/study-wrap`**。

---

## 步骤 1：问用户当前状态（如未明说）

如果用户只说"我要切机"没说在做啥，**一题一问**确认：

- 你刚才在做什么？（写到 handoff.md → What I Was Doing）
- 做到哪一步了？（写到 What I Was Doing 的细节里）
- 有没有卡壳点要记一下？（如有，写到 Open Issues）
- 接下来回来想继续做什么？（如和当前 Next Steps 不同，更新 Next Steps）

如果用户已经主动说了，直接走步骤 2。

## 步骤 2：用 Edit 局部更新 ~/preview/handoff.md

只改这几个字段，**其他保留**：

- `Last Updated`: 今天日期 YYYY-MM-DD
- `What I Was Doing`: 用现在进行时写「**正在做** XXX，做到 YYY 步」（注意：不是"完成了 XXX"）
- `Next Steps`: 如果用户调整了接下来要做的事，相应更新；否则不动
- `Open Issues`: 如果有新卡壳点，append；否则不动

⚠️ **不要碰**：
- `Current Progress` —— 这是当天结束才累加的
- `tracker.json` —— 这是当天结束才更新的
- `Current Phase` —— 阶段没变就不动

## 步骤 3：给用户一份"切机卡"（≤ 6 行）

```
🔄 切机准备就绪

📌 已记录：
- 正在做：[一句话]
- 做到：[一步描述]
- 卡壳：[如有]

🚀 你来跑（同步到 GitHub）：
   cd ~/preview && ./sync.sh out "切机：[简短]"

到另一台电脑后：
   cd ~/preview && ./sync.sh in
   开 Claude 说：/study-context
```

## 步骤 4：等用户跑 sync.sh out，**不要主动 git push**

git push 涉及共享状态，让用户自己跑。
如果用户回复"帮我跑"，再用 Bash 执行。

## ❌ 不要做的事

- ❌ 不要更新 tracker.json（这是收工才做）
- ❌ 不要在 What I Was Doing 写"完成了 XX"——用现在进行时
- ❌ 不要触发倦怠期预警（5.26-6.15 提醒只在 /study-wrap 做）
- ❌ 不要写"今日复盘" / "微复盘 3 问"（这是收工动作）
- ❌ 不要假设用户回到另一台机器后会立刻继续——可能间隔几小时
- ❌ 不要主动 git push

## 主动触发场景

新 session 中，用户说以下任一，主动调用：

- "我要切机" / "换电脑了"
- "要走了" / "出门了" / "去公司了" / "回家了"
- "中场休息" / "先停一下" / "临时离开"
- "/study-sync"

## 何时反向建议改用其他 skill

- 用户说"睡了" / "今天到此为止" / "学完了" → 建议 `/study-wrap`
- 用户说"我刚回来" / "从另一台过来" → 建议 `/study-context`
- 用户说"开始今天" → 建议 `/study-start`

## 周末/周日不特别处理

本 skill 不区分周日，不要触发周复盘提醒——那是 `/study-wrap` 的职责。

## 文件位置

真身：`~/preview/.claude/skills/study-sync/SKILL.md`
软链：`~/.claude/skills/study-sync`
新机器：`bash ~/preview/install-skill.sh`
