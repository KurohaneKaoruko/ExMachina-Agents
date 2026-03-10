#!/usr/bin/env sh
set -e

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
SETTINGS_FILE="$ROOT_DIR/exmachina/openclaw.settings.json"

if [ ! -f "$SETTINGS_FILE" ]; then
  echo "Missing: $SETTINGS_FILE"
  exit 1
fi

echo "ExMachina Prompt-First Install"
echo "1) Read: $ROOT_DIR/install/INTAKE.md"
echo "2) Import: $SETTINGS_FILE (merge only ExMachina agent entries)"
echo "3) Follow: $ROOT_DIR/exmachina/BOOTSTRAP.md"

echo ""
if [ "$#" -eq 0 ]; then
  echo "Tip: You can copy the settings template into your OpenClaw config path."
  echo "Usage: ./install.sh <target-config-path>"
  exit 0
fi

TARGET_PATH="$1"
TARGET_DIR=$(dirname "$TARGET_PATH")

mkdir -p "$TARGET_DIR"
if [ -f "$TARGET_PATH" ]; then
  BACKUP_PATH="$TARGET_PATH.exmachina.bak"
  cp "$TARGET_PATH" "$BACKUP_PATH"
  echo "Backup created: $BACKUP_PATH"
fi

cp "$SETTINGS_FILE" "$TARGET_PATH"
echo "Copied settings template to: $TARGET_PATH"
echo "Note: This replaces the target file; merge manually if needed."


