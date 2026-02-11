#!/bin/bash
set -e

# ──────────────────────────────────────────────────────────────
# Steps 6 & 7: Rotate old build + Deploy new build
# (Mirrors your manual script's Steps 6 and 7)
#
# At this point, CodeDeploy has already copied the built artifact
# into httpdocs_temp. Now we:
#   6. Move current httpdocs → releases/backup_TIMESTAMP
#   7. Move httpdocs_temp → httpdocs
# ──────────────────────────────────────────────────────────────

BASE_DIR="/srv/aitrillion.com/subdomains/ai-dev-front2"

# ── Step 6: Rotate old build ──
echo "=== [Step 6] Rotating old build ==="

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FOLDER="$BASE_DIR/releases/backup_$TIMESTAMP"

if [ -d "$BASE_DIR/httpdocs" ]; then
    mv "$BASE_DIR/httpdocs" "$BACKUP_FOLDER"
    echo "Backup created at: $BACKUP_FOLDER"
else
    echo "No previous httpdocs folder found. Skipping backup."
fi

# ── Step 7: Move new build into place ──
echo "=== [Step 7] Deploying new build ==="

mv "$BASE_DIR/httpdocs_temp" "$BASE_DIR/httpdocs"

echo "New build deployed to httpdocs successfully."
