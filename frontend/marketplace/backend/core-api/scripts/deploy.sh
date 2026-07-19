#!/bin/bash

# Configuration
SERVICE_NAME="doba-api"
REGION="us-central1"

# Automatically find the script's directory
SCRIPT_DIR="$(dirname "$0")"
API_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to API directory
cd "$API_DIR" || exit

# Load .env if exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "🚀 Preparing deployment for $SERVICE_NAME..."

# Pre-flight checks
if [ -z "$PINATA_JWT" ]; then
  echo "❌ Error: PINATA_JWT is not set. Please add it to your .env file."
  exit 1
fi

if [ -z "$TURSO_URL" ] || [ -z "$TURSO_AUTH_TOKEN" ]; then
  echo "⚠️ Warning: TURSO_URL or TURSO_AUTH_TOKEN is missing."
  echo "Your live backend will fallback to local SQLite and reset on every restart."
fi

# Deploy command
echo "📦 Building and deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars PINATA_JWT=$PINATA_JWT,TURSO_URL=$TURSO_URL,TURSO_AUTH_TOKEN=$TURSO_AUTH_TOKEN,NODE_ENV=production \
  --max-instances 1 \
  --memory 512Mi \
  --cpu 1

echo "✅ Deployment complete!"
