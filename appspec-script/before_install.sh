#!/bin/bash
set -e

# ──────────────────────────────────────────────────────────────
# Step 4: Prepare temporary folder
# (Mirrors your manual script's Step 4)
#
# Clean up httpdocs_temp if it exists from a previous failed deploy.
# CodeDeploy will then copy the new build artifact into httpdocs_temp.
# ──────────────────────────────────────────────────────────────

BASE_DIR="/srv/aitrillion.com/subdomains/ai-dev-front2"

echo "=== [Step 4] Preparing temp build directory ==="

# Remove stale temp folder if it exists
if [ -d "$BASE_DIR/httpdocs_temp" ]; then
    rm -rf "$BASE_DIR/httpdocs_temp"
    echo "Cleaned up existing httpdocs_temp"
fi

# Ensure releases directory exists
mkdir -p "$BASE_DIR/releases"

echo "Temp directory ready. CodeDeploy will now copy files to httpdocs_temp."
