#!/usr/bin/env bash
set -eux

COMMIT_REF=$(git rev-parse --verify HEAD)
SHORT_COMMIT_REF=$(git rev-parse --short HEAD)

docker build -t hwaterke/inab:latest -t hwaterke/inab:${SHORT_COMMIT_REF} --build-arg server_version=${COMMIT_REF} .
