#!/bin/bash
# ──────────────────────────────────────────────────────────────
# ApplicationStop — NO-OP (intentional)
# ──────────────────────────────────────────────────────────────
# We do NOT stop PM2 here. The app keeps running while CodeDeploy
# prepares and copies files. PM2 is stopped later in AfterInstall
# right before the folder swap — minimizing downtime.
# ──────────────────────────────────────────────────────────────

echo "=== ApplicationStop: Skipping (PM2 will stop in AfterInstall) ==="