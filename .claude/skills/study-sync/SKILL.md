---
name: study-sync
description: 切机前一键同步——你调用后什么都不用管。Claude 自动检查上下文、更新 handoff.md、commit + push 到 GitHub。⚠️ 这不是收工！不会累加 tracker、不会触发倦怠预警。如果当天真正结束，请改用 /study-wrap。触发关键词：要走了 / 切机 / 换电脑 / 我先离开一下 / 临时停一下 / sync / study-sync。
---

# 切机前自动同步（study-sync）

**核心语义**：临时离开当前电脑，但**不代表结束当天学习**。
用户调用此 skill 后**什么都不用做**——Claude 全自动完成同步。

**关键差异**：

| Skill | 是否结束当天 | 是否累加 tracker | 是否触发倦怠预警 |
|---|---|---|---|
| `/study-sync`（本 skill）| ❌ 不结束 | ❌ 不累加 | ❌ 不触发 |
| `/study-wrap` | ✅ 结束当天 | ✅ 累加 | ✅ 触发 |

如果用户语境是"今天学完了" / "睡觉了" / "明天再来"，**主动建议改用 `/study-wrap`**。

---

## 步骤 1：从 session 自动推断当前在做什么

**先尝试推断**（不要立刻问用户）：
扫描本次 session 用户做了什么实质工作（学习/编辑文件/讨论）。
能推断出"刚才在做什么"就直接用，**不要再问**。

**只有完全推断不出**时，才一题一问：

> 切机前最后一次记录：你刚才主要在做什么？（一句话即可）

⚠️ 用户记忆力受限，**不要堆问题**，最多问 1 次。

## 步骤 2：用 Edit 局部更新 ~/preview/handoff.md

只改这几个字段：

- `Last Updated`: 今天日期 YYYY-MM-DD（用 `date "+%Y-%m-%d"` 获取）
- `What I Was Doing`: **现在进行时**「正在做 XXX，做到 YYY 步」（不是"完成了 XXX"）
- `Next Steps`: 如果用户调整了，相应更新；否则保持不动
- `Open Issues`: 如果有新卡壳点，append；否则保持不动

⚠️ **不要碰**：
- `Current Progress` —— 这是 /study-wrap 才累加
- `tracker.json` —— 这是 /study-wrap 才更新
- `Current Phase` —— 阶段没变就不动

## 步骤 3：自动 commit + push（无需用户介入）

用 Bash 一气呵成执行：

```bash
cd ~/preview
if git diff --quiet handoff.md; then
  echo "handoff.md 无变化，跳过 commit"
else
  git add handoff.md
  git commit -m "sync: <一句话简述，例如：Day 1 中场切机，正在写 #21 解法>"
  git push origin master
fi
```

**commit message 由 Claude 基于步骤 1 推断自动生成**，格式 `sync: <简述>`。

### 如果失败（网络/冲突/凭据）

- 立即报告错误原因
- **不要自动重试**
- 给用户清晰的手动恢复指引（例如：`git pull --rebase` 解冲突 / 检查网络 / 重新登录 GitHub）

## 步骤 4：给用户简短确认（≤ 5 行）

成功格式：

```
🔄 已同步并推送（commit <短 hash>）
- 当前在做：[一句话，What I Was Doing]
- 远程：origin/master ✅

切到另一台 → cd ~/preview && claude → 说 /study-context，自动接上
```

失败格式：

```
❌ 同步失败：<错误原因>
- 建议操作：<具体命令>
- 修复后告诉我，我重试
```

## ❌ 不要做的事

- ❌ 不要让用户手动跑 ./sync.sh out 或 git 命令（你调用此 skill 已授权 Claude 自动 push）
- ❌ 不要更新 tracker.json
- ❌ 不要在 What I Was Doing 写"完成了 XX"——用现在进行时
- ❌ 不要触发倦怠预警（5.26-6.15 提醒只在 /study-wrap）
- ❌ 不要做"微复盘 3 问"（这是 /study-wrap 的职责）
- ❌ 不要堆问题（最多一题一问，用户记忆力受限）

## 主动触发场景

新 session 中，用户说以下任一，主动调用：

- "我要切机" / "换电脑了"
- "要走了" / "出门了" / "去公司了" / "回家了"
- "中场休息" / "先停一下" / "临时离开"
- "/study-sync"

## 何时反向建议改用其他 skill

- "睡了" / "今天到此为止" / "学完了" → 建议 `/study-wrap`
- "我刚回来" / "从另一台过来" → 建议 `/study-context`
- "开始今天" → 建议 `/study-start`

## 周末/周日不特别处理

本 skill 不区分周日，不触发周复盘提醒——那是 `/study-wrap` 的职责。

## 文件位置

真身：`~/preview/.claude/skills/study-sync/SKILL.md`
软链：`~/.claude/skills/study-sync`
新机器：`bash ~/preview/install-skill.sh`
