#!/usr/bin/env bash

set -ex

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker push hwaterke/inab-api
#docker push hwaterke/inab-api:${SHORT_COMMIT_REF}
