#!/usr/bin/env bash
set -ex

cp babelrc.json .babelrc
rm -r lib || true
yarn build:babel
yarn build:flow
rm .babelrc
