#!/usr/bin/env bash

# COPYRIGHT (c) 2019, QUANTUMSTACK. ALL RIGHTS RESERVED.

# Exit with failure code on error.
set -e


# Copy config file over
cp ./src/tests/files/travis.config.js ./src/config.js

# Rollback then migrate
./src/tests/scripts/rollbackandmigrate.sh

# Run tests
nyc mocha ./src/tests/routes --recursive --exit
