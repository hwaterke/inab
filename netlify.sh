#!/usr/bin/env bash
set -ex

if [ "x$NETLIFY" = "xtrue" ]; then
  rm -r packages/native packages/server
fi
