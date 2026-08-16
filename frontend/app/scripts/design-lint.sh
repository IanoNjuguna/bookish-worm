#!/usr/bin/env bash
# design-lint.sh — mechanically enforce DESIGN.md rules that grep can catch.
# Exits 1 and prints offending file:line if any banned pattern is found.
# Run: npm run lint:design   (from frontend/app)

set -u
cd "$(dirname "$0")/.."

fail=0

check() {
  local label="$1" pattern="$2" exclude="${3:-}"
  local hits
  hits=$(grep -rnE "$pattern" --include='*.tsx' --include='*.ts' --include='*.css' app components styles 2>/dev/null)
  if [[ -n "$exclude" ]]; then
    hits=$(echo "$hits" | grep -vE "$exclude" || true)
  fi
  if [[ -n "$hits" ]]; then
    echo "✗ $label"
    echo "$hits" | head -10
    echo ""
    fail=1
  fi
}

echo "design-lint: checking DESIGN.md rules..."

# 1. Retired angular shape system must not come back
check "Retired angular system (clip-*/rounded-none) — use rounded classes + .glass-surface" \
  'clip-angular|clip-hexagon|clip-diamond|clip-tag|rounded-none'

# 2. No arbitrary hex colors in class strings (tokens exist for all brand colors)
check "Inline hex class — use tokens (cyber-pink, lavender, midnight, background, card, …)" \
  '\[#[0-9A-Fa-f]{6}\]' \
  '4285F4|5865F2|EDE4F9|140b19|FAF3FF'

# 3. Flat cyber-pink on the playing indicator — must be theme-aware
check "Visualizer/equalizer must be theme-aware (pink-600 light / cyber-pink dark)" \
  'DobaVisualizer[^\n]*text-cyber-pink|equalizer-bar' \
  'pink-600|globals\.css'

# 4. No hard-cut shell divider lines (feathered gradient rules only)
check "Hard divider hairline — use the feathered gradient rule from DESIGN.md" \
  'h-\[1px\][^"\n]*bg-midnight/\[0\.0[68]\][^"\n]*dark:bg-white/\[0\.0[68]\]"' \
  'bg-gradient-to-'

# 5. CSS border-hack spinners — use IconLoader2 with the theme-aware pair
check "CSS spinner (border-t-transparent) — use <IconLoader2 className=\"animate-spin text-pink-600 dark:text-cyber-pink\" />" \
  'border-t-transparent'

# 6. Ad-hoc skeletons — use the Skeleton primitive (ui/skeleton.tsx)
check "Ad-hoc skeleton body — use <Skeleton /> (animate-pulse glass) with a shape-matching radius" \
  'animate-pulse[^\n]*(bg-midnight/5|bg-muted)|(bg-midnight/5|bg-muted)[^\n]*animate-pulse'

if [[ "$fail" -eq 0 ]]; then
  echo "✓ design-lint passed"
else
  echo "design-lint failed — see DESIGN.md sections 1 & 5 for the correct patterns."
  exit 1
fi
