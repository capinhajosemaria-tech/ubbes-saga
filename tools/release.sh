#!/bin/sh
# Usage: sh tools/release.sh "Beta 0.6.2"
# Sets the version, builds, and copies the built game to the repository root (what GitHub Pages serves).
set -e
R=$(cd "$(dirname "$0")/.." && pwd)
[ -n "$1" ] && printf '%s\n' "$1" > "$R/source/VERSION"
python3 "$R/source/build.py"
cp "$R/source/dist/index.html" "$R/source/dist/sw.js" "$R/source/dist/manifest.webmanifest" "$R/"
cp "$R/source/dist/"icon-*.png "$R/"
mkdir -p "$R/music" && cp "$R/source/music/"*.mp3 "$R/music/"
V=$(cat "$R/source/VERSION")
sed -i "s/Current version: \*\*[^*]*\*\*/Current version: **$V**/" "$R/README.md"
echo "Ready to commit: $V"
