#!/bin/bash

# 同步 .env 中的 secrets 到 Cloudflare Workers

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env file not found at $ENV_FILE"
  exit 1
fi

echo "Syncing secrets from .env to Cloudflare Workers..."

bunx wrangler secret bulk "$ENV_FILE"

echo "Done!"
