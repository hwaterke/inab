#!/usr/bin/env bash
set -ex

echo "Building shared"
cd packages/shared
yarn build
yarn pack --filename ../../native/inab-shared.tgz
cd ../..

echo "Preparing native app"
cd native

echo "Fixing yarn lock hash issue"
yarn add file:./inab-shared.tgz

echo "Ready"
