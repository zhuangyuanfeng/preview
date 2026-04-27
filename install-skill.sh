#!/bin/bash
# 一次性安装：把 preview 项目里的 study-context skill 软链到全局
# 新电脑/新机器首次使用前跑一次即可，后续随 git 同步自动更新。

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_DIR="$PROJECT_DIR/.claude/skills/study-context"
TARGET_DIR="$HOME/.claude/skills/study-context"

echo "📦 安装 study-context skill"
echo "   源：$SOURCE_DIR"
echo "   目标：$TARGET_DIR"
echo ""

# 1. 检查源是否存在
if [ ! -d "$SOURCE_DIR" ]; then
  echo "❌ skill 源目录不存在：$SOURCE_DIR"
  echo "   请确认 preview 仓库已最新（git pull）"
  exit 1
fi

# 2. 准备全局 skills 目录
mkdir -p "$HOME/.claude/skills"

# 3. 处理已有目标
if [ -L "$TARGET_DIR" ]; then
  echo "⚠️  已存在软链接，将重新创建"
  rm "$TARGET_DIR"
elif [ -e "$TARGET_DIR" ]; then
  echo "❌ $TARGET_DIR 已存在且不是软链接（可能是真目录或文件）"
  echo "   请手动检查并备份后再运行此脚本"
  exit 1
fi

# 4. 创建软链
ln -s "$SOURCE_DIR" "$TARGET_DIR"

# 5. 验证
if [ -L "$TARGET_DIR" ] && [ -f "$TARGET_DIR/SKILL.md" ]; then
  echo "✅ skill 'study-context' 已安装"
  echo ""
  echo "测试方法："
  echo "  1. 在任意目录新开一个 Claude session"
  echo "  2. 输入：/study-context"
  echo "  3. 或自然说："恢复上下文" / "我回来了" / "接着学""
  echo ""
  echo "💡 之后 SKILL.md 内容若有更新，git pull 即生效，不需要再跑此脚本"
else
  echo "❌ 软链创建失败，请检查"
  exit 1
fi
