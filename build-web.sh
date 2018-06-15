#!/usr/bin/env bash
set -ex

cd packages/shared
yarn build
cd ../..

cd packages/web
yarn build
cd ../..
