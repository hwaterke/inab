#!/usr/bin/env bash
set -ex

cd packages/inab-shared
yarn build
yarn build:flow
cd ../..

cd packages/inab-web
yarn build
cd ../..
