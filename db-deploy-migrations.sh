#!/usr/bin/env bash
set -euo pipefail

ENV_FILE=".env"

# Load .env file
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ .env file not found"
  exit 1
fi

# Load env vars (including REMOTE_DB_URL)
set -a
source "$ENV_FILE"
set +a

# Strip quotes if needed
REMOTE_DB_URL=${REMOTE_DB_URL//\"/}

# Use it to override the Prisma database URL
POSTGRES_PRISMA_URL="$REMOTE_DB_URL" npx prisma migrate deploy
