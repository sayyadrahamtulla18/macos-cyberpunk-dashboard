#!/bin/bash
set -e

WIDGET_DIR="$HOME/Library/Application Support/Übersicht/widgets"
TARGET_NAME="cyberpunk-dashboard.widget"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== Installing Cyberpunk Dashboard Widget for macOS ==="

if [ ! -d "$WIDGET_DIR" ]; then
  echo "Error: Übersicht widgets directory not found at:"
  echo "  $WIDGET_DIR"
  echo "Please download and run Übersicht first: https://tracesof.net/uebersicht/"
  exit 1
fi

echo "Copying $TARGET_NAME into Übersicht..."
mkdir -p "$WIDGET_DIR/$TARGET_NAME"
cp -R "$SCRIPT_DIR/$TARGET_NAME/"* "$WIDGET_DIR/$TARGET_NAME/"
chmod +x "$WIDGET_DIR/$TARGET_NAME/status.py"

echo "Refreshing Übersicht..."
osascript -e 'tell application "Übersicht" to refresh' 2>/dev/null || true

echo "=== Installation complete! Enjoy your new desktop dashboard. ==="

