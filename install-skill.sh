#!/bin/bash
# 一次性安装：把 preview 项目里所有 skill 软链到全局 ~/.claude/skills/
# 自动遍历 .claude/skills/ 下所有子目录，未来加新 skill 不需要改这个脚本。
# 新电脑首次使用前跑一次即可，之后随 git 同步自动生效。

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_BASE="$PROJECT_DIR/.claude/skills"
TARGET_BASE="$HOME/.claude/skills"

echo "📦 安装 preview 项目的 skills"
echo "   源：$SOURCE_BASE"
echo "   目标：$TARGET_BASE"
echo ""

# 1. 检查源目录
if [ ! -d "$SOURCE_BASE" ]; then
  echo "❌ 项目里没有 .claude/skills 目录"
  echo "   请确认 preview 仓库已最新（git pull）"
  exit 1
fi

# 2. 准备全局 skills 目录
mkdir -p "$TARGET_BASE"

# 3. 遍历每个 skill 子目录
installed=0
skipped=0
for skill_dir in "$SOURCE_BASE"/*/; do
  [ -d "$skill_dir" ] || continue

  skill_name=$(basename "$skill_dir")
  source="$SOURCE_BASE/$skill_name"
  target="$TARGET_BASE/$skill_name"

  if [ -L "$target" ]; then
    rm "$target"
  elif [ -e "$target" ]; then
    echo "  ⚠️  跳过 $skill_name（$target 已存在且不是软链，请手动处理）"
    skipped=$((skipped + 1))
    continue
  fi

  ln -s "$source" "$target"
  if [ -f "$target/SKILL.md" ]; then
    echo "  ✅ $skill_name"
    installed=$((installed + 1))
  else
    echo "  ❌ $skill_name 软链创建后找不到 SKILL.md"
    rm "$target"
  fi
done

echo ""
echo "完成：已安装 $installed 个 skill$([ $skipped -gt 0 ] && echo "，跳过 $skipped 个")"
echo ""
echo "Skill 速查："
echo "  /study-start    新的一天第一次开学（启动仪式）"
echo "  /study-context  从另一台电脑/上次 session 继承上下文"
echo "  /study-sync     切机前同步（不结束当天）"
echo "  /study-wrap     当天真正结束（累加进度+复盘）"
echo ""
echo "💡 之后 SKILL.md 内容若有更新，git pull 即生效，不需要再跑此脚本"
echo "   只有新增/删除 skill 时才需要重跑"
