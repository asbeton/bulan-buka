#!/usr/bin/env bash
set -euo pipefail

# Saleh — rollback script
# Usage: ./rollback.sh [target_dir]

TARGET="${1:-$HOME/Desktop/Saleh}"

echo "→ Saleh rollback"
echo "  Target: $TARGET"

LATEST_BACKUP=$(ls -d "${TARGET}.bak-"* 2>/dev/null | sort -r | head -1 || true)

if [ -z "$LATEST_BACKUP" ]; then
  echo "  ✗ Backup tapılmadı (${TARGET}.bak-*)"
  exit 1
fi

echo "  → Tapıldı: $LATEST_BACKUP"
read -p "  Bu nüsxəyə geri qaytarılsın? (y/N): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
  echo "  Ləğv edildi."
  exit 0
fi

if [ -d "$TARGET" ]; then
  DISCARD="${TARGET}.rollback-discarded-$(date +%Y%m%d-%H%M%S)"
  echo "  → Hazırkı versiya kənara qoyulur: $DISCARD"
  mv "$TARGET" "$DISCARD"
fi

mv "$LATEST_BACKUP" "$TARGET"
echo "✓ Geri qayıdıldı → $TARGET"
