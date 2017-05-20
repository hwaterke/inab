#!/usr/bin/env bash

set -e

# ----------------------------------------
# Some utility functions
# ----------------------------------------
function blue {
  echo -e "\033[34m$1\033[0m"
}

function blue_line {
  printf "\033[34m$1\033[0m"
}

function green {
  echo -e "\033[32m$1\033[0m"
}

function check {
  green "\xE2\x9C\x94"
}

# ----------------------------------------
# Main
# ----------------------------------------

TAG=$(git rev-parse HEAD)
BRANCH=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)
TMP_DIR_NAME="tmp_build"

echo "Exiting if uncommitted changes..."
git diff-index --quiet HEAD --

echo "Building for:"
printf "  Branch: "
blue $BRANCH
printf "  Tag: "
blue $TAG
echo

blue_line "Installing node dependencies... "
yarn > /dev/null 2>&1
check

blue_line "Cleaning... "
rm -r lib > /dev/null 2>&1 || true
check

blue_line "Compiling... "
yarn compile > /dev/null 2>&1
check

blue_line "Compiling flow types... "
yarn compile:flow > /dev/null 2>&1
check

# Copy lib somewhere safe
blue_line "Saving build files... "
rm -r $TMP_DIR_NAME > /dev/null 2>&1 || true
mkdir $TMP_DIR_NAME
mv lib $TMP_DIR_NAME/
cp package.json $TMP_DIR_NAME/
check

blue "Checking out build branch... "
git checkout build

blue_line "Cleaning old build... "
rm package.json > /dev/null 2>&1 || true
rm -r lib > /dev/null 2>&1 || true
check

blue_line "Loading new build... "
# Bring back the lib just built
mv $TMP_DIR_NAME/package.json .
mv $TMP_DIR_NAME/lib .
rm -r $TMP_DIR_NAME > /dev/null 2>&1
check

# Commit ?
blue_line "Commit new build... "
git add .
git commit -v -m "Build of $TAG"
git push
git checkout $BRANCH
blue Done
