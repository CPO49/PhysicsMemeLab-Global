#!/usr/bin/env bash
set -euo pipefail

if [[ ! -d .git ]]; then
  echo "Run from repository root after git init." >&2
  exit 1
fi

if [[ -z "$(git status --porcelain)" ]]; then
  echo "No changes."
  exit 0
fi

git add -A
if git diff --cached --quiet; then exit 0; fi
git commit -m "chore(checkpoint): manual $(date '+%Y-%m-%d %H:%M')"
# Intentionally does not push.
