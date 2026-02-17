#!/bin/bash
set -e

# ──────────────────────────────────────────────────────────────
# ApplicationStart: Start PM2 + Cleanup
# ──────────────────────────────────────────────────────────────
# Downtime ends here — PM2 starts the app.
# ──────────────────────────────────────────────────────────────

# Load deployment config (written by after_install.sh)
CONFIG_FILE="/tmp/deployment_config_current.sh"
if [ ! -f "$CONFIG_FILE" ]; then
    echo "ERROR: No deployment config found at $CONFIG_FILE!"
    exit 1
fi

source "$CONFIG_FILE"

echo "=== Starting: $ENV_NAME | Port: $APP_PORT | Path: $BASE_DIR ==="

cd "$BASE_DIR/httpdocs"

export PM2_HOME="$BASE_DIR/.pm2"
export NODE_ENV=production

# Fix symlinks and native modules after deployment
echo "Running npm rebuild..."
npm rebuild

# Start the app with PM2
PORT=$APP_PORT pm2 start npm --name "$ENV_NAME" -- start
pm2 save

echo "PM2 app started."
pm2 status

# ── Cleanup old backups (keep last 5) ──
echo "=== Cleaning older backups (keeping last 5) ==="

cd "$BASE_DIR/releases"
ls -1dt backup_* 2>/dev/null | tail -n +6 | xargs -I {} rm -rf "{}" || true

echo "=== Deployment completed successfully! ==="
echo "App: $ENV_NAME | Port: $APP_PORT | Path: $BASE_DIR/httpdocs"