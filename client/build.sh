#!/usr/bin/env bash
docker run \
  --rm \
  --name inab-build \
  -v "$(pwd):/app" \
  -w /app \
  node \
  bash -c "npm install && npm run build"
