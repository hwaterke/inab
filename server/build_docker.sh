#!/usr/bin/env bash
set -e

echo "Updating docker dependencies"
docker pull ruby:alpine

echo "Building docker image (API only)"
docker build -t hwaterke/inab:api -f Dockerfile-prod .

echo "Building client"
cd ../client
rm -r build || true
./build.sh

echo "Moving client build to server folder"
mv build ../server/

cd ../server

echo "Building docker image"
docker build -t hwaterke/inab -f Dockerfile-prod-all .

echo "Cleaning"
rm -r build

echo "To push to docker do:"
echo "  docker login"
echo "  docker push hwaterke/inab"
echo "  docker push hwaterke/inab:api"
