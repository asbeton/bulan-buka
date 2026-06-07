#!/usr/bin/env bash
set -euo pipefail

# Saleh — apply script
# Usage: ./apply.sh [target_dir]
# Default target: ~/Desktop/Saleh

TARGET="${1:-$HOME/Desktop/Saleh}"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "→ Saleh apply.sh"
echo "  Target: $TARGET"

if [ -d "$TARGET" ]; then
  echo "  ! Target qovluğu mövcuddur."
  read -p "  Əvvəlki nüsxə üzərinə yazılsın? (y/N): " confirm
  if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "  Ləğv edildi."
    exit 0
  fi
  BACKUP="${TARGET}.bak-$(date +%Y%m%d-%H%M%S)"
  echo "  → Backup yaradılır: $BACKUP"
  mv "$TARGET" "$BACKUP"
fi

mkdir -p "$TARGET"

TARBALL=$(ls "$SCRIPT_DIR"/saleh-*.tar.gz 2>/dev/null | head -1)
if [ -z "$TARBALL" ]; then
  echo "  ✗ saleh-*.tar.gz tapılmadı ($SCRIPT_DIR)"
  exit 1
fi

echo "  → Açılır: $(basename "$TARBALL")"
tar -xzf "$TARBALL" --strip-components=1 -C "$TARGET"

echo "  → npm install (bir neçə dəqiqə çəkə bilər)..."
cd "$TARGET"
if command -v npm >/dev/null 2>&1; then
  npm install
else
  echo "  ✗ npm tapılmadı. Node.js 18+ quraşdırın: https://nodejs.org"
  exit 1
fi

echo ""
echo "✓ Saleh hazırdır → $TARGET"
echo ""
echo "Növbəti addımlar:"
echo "  cd $TARGET"
echo "  npm start          # Metro bundler"
echo "  npm run ios        # iOS simulator"
echo "  npm run android    # Android emulator"
echo ""
echo "Asset şəkillərini /assets/-ə yerləşdirməyi unutmayın:"
echo "  icon.png (1024×1024), splash.png (1284×2778), adaptive-icon.png"
