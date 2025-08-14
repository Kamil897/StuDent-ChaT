#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "[redeploy] repo: $REPO_DIR"
cd "$REPO_DIR"

echo "[redeploy] git fetch..."
git fetch --all --prune

echo "[redeploy] git reset --hard origin/main"
git reset --hard origin/main

echo "[redeploy] install deps..."
if command -v pnpm >/dev/null 2>&1; then
  pnpm i --frozen-lockfile || pnpm i
elif command -v yarn >/dev/null 2>&1; then
  yarn install --frozen-lockfile || yarn install
else
  npm ci || npm i
fi

echo "[redeploy] build (если нужно, раскомментируй)"
# npm run build

echo "[redeploy] restart node process..."
# Если используешь pm2:
# pm2 startOrReload ecosystem.config.js
# Или systemd:
# sudo systemctl restart student-chat-backend

echo "[redeploy] done."
