---
name: study-context
description: 跨机继承学习上下文——你调用后什么都不用管。Claude 自动 git pull、读取所有上下文、告诉你「上次在做什么 + 接下来做什么」。这个 skill 不假设是新一天的开始，可能是中途切机/几小时前/昨天延续。如果是新一天的开始仪式，应改用 /study-start；如果是收工，应改用 /study-wrap。触发关键词：恢复上下文 / 我回来了 / 接着学 / 从另一台机过来 / preview / study-context。
---

# 跨机继承学习上下文（study-context）

**核心语义**：跨机/跨 session 的「我回来了」。
用户调用此 skill 后**什么都不用做**——Claude 全自动完成继承。

**与其他 skill 的边界**：

| Skill | 何时用 |
|---|---|
| `/study-context`（本 skill）| 从另一台电脑或几小时前的 session 回来，**继续**之前的事 |
| `/study-start` | **新的一天**第一次开学，需要启动仪式 |
| `/study-sync` | 切机前同步（A 机离开但**没收工**） |
| `/study-wrap` | 当天**真正结束**，做总结 + 更新 tracker |

如果用户的语境明显是"开始新一天"或"收工"，**主动建议改用对应 skill**，而不是硬走本流程。

---

## 步骤 1：自动 git pull（确保拉到最新）

用 Bash 执行：

```bash
cd ~/preview && git pull --rebase
```

如果失败：
- 报告错误原因（网络/冲突/凭据）
- **不要继续后续步骤**，提示用户手动处理
- 不要自动重试

成功（包括"Already up to date"）就继续步骤 2。

## 步骤 2：读 4 个核心文件

按顺序 Read：

1. `~/preview/LEARNING-CONTEXT.md` — 静态：用户画像、协作约定、v2 决策
2. `~/preview/handoff.md` — 动态：上次同步时的状态，**重点看 What I Was Doing 和 Next Steps**
3. `~/preview/WEEKLY-PLAN.md` — 找当前 Week 卡片（按 handoff 的 Current Phase 定位）
4. `~/preview/PAIN-POINTS.md` — 痛点池状态（已填几个 / 本周计划解哪个）

## 步骤 3：输出三段（继承 + 引导）

⚠️ 措辞重点：用「上次」而不是「今天」，因为可能间隔几小时也可能间隔几天。

完整格式：

```
✅ 已从上次状态继承

📌 上次离开时在做什么
- 时间：[handoff.md → Last Updated]
- 当时在做：[handoff.md → What I Was Doing]
- 完成进度：算法 X/100 · JS 手写 X/9 · 痛点池 X/10
- 阶段：v2 / Week N (MM.DD-MM.DD) — 当周主题

🎯 接下来要继续的（来自 handoff.md → Next Steps）
1. [时间线最近的第 1 项，写具体]
2. [第 2 项，写具体]
3. [第 3 项，如有]

💡 你的下一步可以选：
   A. 「接着做第 1 步」→ 我陪你跑
   B. 「先看一下当前状态再决定」→ 我帮你判断
   C. 「这是新的一天」→ 我建议你改用 /study-start 走启动仪式
   D. 「我要收工」→ 改用 /study-wrap
   E. 直接说你想做的事

约定：一题一问 · 视觉化 · 直白反馈 · 配 Demo · 绝不延期
```

输出后**等待用户回复**，不要主动开始任务。

## ❌ 不要做的事

- ❌ 不要让用户手动跑 ./sync.sh in 或 git pull（已在步骤 1 自动）
- 不要重新讨论 v1 vs v2 决策（已定，commit `3b35ee1`）
- 不要重新提议做学习风格测评（已做，2026-04-27）
- 不要假设这是新一天的开始（用户可能 1 小时前刚同步过来）
- 不要在输出里省掉「下一步选择」段——用户会卡壳
- 不要主动开始第 1 步——必须等用户确认
- 不要更新任何文件（不写 handoff、不动 tracker）——继承上下文是只读操作

## ✅ 协作约定（确认后等用户指令时遵守）

- 视觉先导（图 / 类比 / 动画优先）
- 直白反馈（不用苏格拉底式反问）
- 给独处时间，不连续追问
- 每知识点配 1 图 + 1 demo（防听懂幻觉）
- 测评/问卷一题一问
- 熟悉领域允许直接动手（前端 OK，AI 要先原理）

## 🚨 主动预警时机

- **Week 5-7（5.26-6.15）**：倦怠高发期，提醒痛点项目刺激度
- 连续 ≥ 2 天没碰算法/JS：可能听懂幻觉，建议出 demo
- 用户提议「延期 / 砍目标 / 改回日打卡」：温和但坚定指出 v2 的设计原因

## 何时主动调用此 skill

新 session 第一句话符合下列模式，**自动调用**：

- "我回来了" / "继续" / "接着学" / "从另一台过来"
- 任何在 cwd=`~/preview` 且当前 session 还没读过 LEARNING-CONTEXT.md 的开场白
- "/study-context"（显式调用）

## 何时反向建议改用其他 skill

- 用户说"今天开始" / "新的一天" / "早上好" → 建议改用 `/study-start`
- 用户说"我做完了" / "收工" / "今天结束" → 建议改用 `/study-wrap`
- 用户说"我要换电脑" / "要走了" → 建议改用 `/study-sync`

## 文件位置

真身：`~/preview/.claude/skills/study-context/SKILL.md`（随 git 同步）
软链：`~/.claude/skills/study-context` → 上述路径

新机器首次：`bash ~/preview/install-skill.sh`
