#!/bin/bash
# 黑湖招聘官网 · 职位数据每日同步 + 双端推送
# 由 LaunchAgent 每日调度（见 ~/Library/LaunchAgents/cn.blacklake.careers.sync.plist）
# 链路：飞书招聘 → jobs.json → push GitHub(Pages 线上刷新) + GitLab(触发 deploy-test)
set -u
REPO="/Users/kino/blacklake-careers"
LOG="$HOME/Library/Logs/blacklake-careers-sync.log"
LARKCLI="$HOME/.npm-global/bin/lark-cli"
PYTHON="/usr/bin/python3"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG"; }

cd "$REPO" || { log "FATAL: 仓库目录不存在"; exit 1; }
export PATH="/usr/local/bin:/usr/bin:/bin:$HOME/.npm-global/bin"

BEFORE=$(git rev-parse HEAD)
"$PYTHON" scripts/sync_jobs.py --lark-cli >> "$LOG" 2>&1 || { log "FATAL: 同步失败"; exit 1; }

if git diff --quiet -- jobs.json; then
  log "职位数据无变化，结束"
  exit 0
fi

git add jobs.json
git commit -m "sync: 飞书招聘在招职位自动同步（本机定时任务）" >> "$LOG" 2>&1 || { log "FATAL: 提交失败"; exit 1; }

if git push origin main >> "$LOG" 2>&1; then
  log "已推送 GitHub（Pages 将自动更新）"
else
  log "WARN: GitHub 推送失败"
fi
if git push gitlab main >> "$LOG" 2>&1; then
  log "已推送 GitLab（将自动触发 deploy-test）"
else
  log "WARN: GitLab 推送失败（若远端有新提交，下次运行前可手动 git pull --rebase）"
fi
log "完成：$BEFORE → $(git rev-parse --short HEAD)"
