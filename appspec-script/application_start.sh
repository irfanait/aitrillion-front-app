#!/bin/bash
set -e

# ──────────────────────────────────────────────────────────────
# Steps 8 & 9: Start PM2 app + Cleanup old backups
# (Mirrors your manual script's Steps 8 and 9)
# ──────────────────────────────────────────────────────────────

BASE_DIR="/srv/aitrillion.com/subdomains/ai-dev-front2"

# ── Step 8: Start PM2 app ──
echo "=== [Step 8] Starting PM2 app ==="

cd "$BASE_DIR/httpdocs"

export NODE_ENV=development
export PM2_HOME="$BASE_DIR/.pm2"
npm rebuild
PORT=3005 pm2 start npm --name "ai-dev-front2" -- start

echo "PM2 app started."
pm2 status

# Go back to base directory
cd "$BASE_DIR"

# ── Step 9: Cleanup old backups (keep last 5) ──
echo "=== [Step 9] Cleaning older backups (keeping last 5) ==="

cd "$BASE_DIR/releases"
ls -1dt backup_* 2>/dev/null | tail -n +6 | xargs -I {} rm -rf "{}" || true
cd "$BASE_DIR"

echo "=== Deployment completed successfully! ==="
