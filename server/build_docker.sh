#!/usr/bin/env bash
set -e

echo "Updating docker dependencies"
docker pull ruby:alpine

echo "Building docker image (API only)"
docker build -t hwaterke/inab:api -f Dockerfile-prod .

echo "Cleaning"
rm -r build

echo "To push to docker do:"
echo "  docker login"
echo "  docker push hwaterke/inab:api"
