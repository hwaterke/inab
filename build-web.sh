#!/usr/bin/env bash
set -ex

cd packages/inab-shared
yarn compile
yarn compile:flow
cd ../..

cd packages/inab-web
yarn build
cd ../..
