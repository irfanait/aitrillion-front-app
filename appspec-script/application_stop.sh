#!/bin/bash
# ──────────────────────────────────────────────────────────────
# Step 5: Stop PM2 app
# (Mirrors your manual script's Step 5)
# ──────────────────────────────────────────────────────────────

echo "=== [Step 5] Stopping PM2 app ==="

pm2 stop ai-dev-front2 || true
pm2 delete ai-dev-front2 || true

echo "PM2 app stopped."
