#!/usr/bin/env bash
set -e

echo "Updating docker dependencies"
docker pull node:alpine

echo "Building frontend"
docker run \
  --rm \
  --name inab-build \
  -v "$(pwd):/app" \
  -w /app \
  node:alpine \
  sh -c "yarn && yarn build"
