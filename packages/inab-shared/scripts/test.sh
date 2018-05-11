#!/usr/bin/env bash
set -ex

cp babelrc.json .babelrc
yarn jest
rm .babelrc
