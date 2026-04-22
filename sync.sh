#!/bin/bash
# 两台电脑同步 Claude Code 工作状态
# 用法：
#   离开前：./sync.sh out "简述你在做什么"
#   到另一台：./sync.sh in

cd "$(dirname "$0")"

case "$1" in
  out)
    # 1. 更新交接文件
    DATE=$(date +%Y-%m-%d)
    MSG="${2:-no message}"

    # 更新 handoff.md 的日期和内容
    sed -i '' "s/^## Last Updated.*/## Last Updated\n${DATE}/" handoff.md
    sed -i '' "s/^## What I Was Doing.*/## What I Was Doing\n${MSG}/" handoff.md

    # 2. 提交并推送
    git add -A
    git commit -m "sync: ${MSG}"
    git push

    echo "✅ 已同步到远程，另一台电脑运行 ./sync.sh in"
    ;;

  in)
    # 1. 拉取最新
    git pull --rebase

    # 2. 显示交接内容
    echo ""
    echo "📋 上次交接内容："
    echo "─────────────────"
    cat handoff.md
    echo ""
    echo "─────────────────"
    echo "✅ 已同步。可以告诉 Claude：请看 handoff.md 恢复上下文"
    ;;

  *)
    echo "用法："
    echo "  离开前：./sync.sh out \"我在做xxx\""
    echo "  到达后：./sync.sh in"
    ;;
esac
