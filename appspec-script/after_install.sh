#!/bin/bash
set -e

# ──────────────────────────────────────────────────────────────
# AfterInstall: Stop PM2 → Backup → Swap
# ──────────────────────────────────────────────────────────────
# Artifact is now at /tmp/codedeploy_artifact. We stop PM2 here
# (NOT in ApplicationStop) to minimize downtime — the app was
# running while files were being prepared and copied.
#
# Downtime window: from PM2 stop → to PM2 start (in ApplicationStart)
# ──────────────────────────────────────────────────────────────

# Load deployment config from NEW artifact
CONFIG_FILE="/tmp/codedeploy_artifact/deployment_config.sh"
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
else
    echo "ERROR: deployment_config.sh not found in artifact!"
    exit 1
fi

echo "=== Deploying: $ENV_NAME | Port: $APP_PORT | Path: $BASE_DIR ==="

# Ensure directories exist (important for first deployment)
mkdir -p "$BASE_DIR/releases"
mkdir -p "$BASE_DIR/.pm2"

# ── STOP PM2 (downtime starts here) ──
echo "=== Stopping PM2: $ENV_NAME ==="

export PM2_HOME="$BASE_DIR/.pm2"
pm2 stop "$ENV_NAME" || true
pm2 delete "$ENV_NAME" || true
echo "PM2 stopped."

# ── Rotate old build ──
echo "=== Rotating old build ==="

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FOLDER="$BASE_DIR/releases/backup_$TIMESTAMP"

if [ -d "$BASE_DIR/httpdocs" ]; then
    mv "$BASE_DIR/httpdocs" "$BACKUP_FOLDER"
    echo "Backup created at: $BACKUP_FOLDER"
else
    echo "No previous httpdocs folder found. Skipping backup."
fi

# ── Move new build into place ──
echo "=== Deploying new build ==="

mv /tmp/codedeploy_artifact "$BASE_DIR/httpdocs"

# Save deployment config for current and future use
# - env-specific: persistent, prevents conflicts between environments
# - current: for ApplicationStart to read (CodeDeploy runs one deploy at a time per EC2)
cp "$BASE_DIR/httpdocs/deployment_config.sh" "/tmp/deployment_config_${ENV_NAME}.sh"
cp "$BASE_DIR/httpdocs/deployment_config.sh" "/tmp/deployment_config_current.sh"

echo "New build deployed to $BASE_DIR/httpdocs"