#!/usr/bin/env bash
set -ex

cd packages/inab-shared
yarn build
cd ../..

cd packages/inab-web
yarn build
cd ../..
