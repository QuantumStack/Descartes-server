#!/usr/bin/env bash

# Exit with failure code on error.
set -e


# Copy config file over
cp ./src/tests/files/testconfig.js ./src/config.js

# Rollback then migrate
npx knex --knexfile ./src/db/knexfile.js migrate:rollback --all
npx knex --knexfile ./src/db/knexfile.js migrate:latest

# Run tests
mocha ./src/tests --recursive --exit
