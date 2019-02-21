#!/usr/bin/env bash

set -ex

COMMIT_REF=$(git rev-parse --verify HEAD)
SHORT_COMMIT_REF=$(git rev-parse --short HEAD)

yarn build

docker pull node:10-alpine
docker build --no-cache -t hwaterke/inab-api:latest -t hwaterke/inab-api:${SHORT_COMMIT_REF} --build-arg server_version=${COMMIT_REF} .
