#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

npm install

if [ ! -f .env.local ]; then
  cp .env.example .env.local
fi

npm install -g @anthropic-ai/claude-code
