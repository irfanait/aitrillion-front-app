#!/bin/bash
set -e

# ──────────────────────────────────────────────────────────────
# BeforeInstall: Prepare directories
# ──────────────────────────────────────────────────────────────
# App is still running at this point. We just prepare directories
# and clean up temp files from any previous deployment.
# ──────────────────────────────────────────────────────────────

echo "=== BeforeInstall: Preparing directories ==="

# Clean up previous temp artifact if it exists
if [ -d "/tmp/codedeploy_artifact" ]; then
    rm -rf /tmp/codedeploy_artifact
    echo "Cleaned up previous temp artifact"
fi

echo "Ready for CodeDeploy to copy new artifact."