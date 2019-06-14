#!/usr/bin/env bash

# Rollback then migrate
npx knex --knexfile ./src/db/knexfile.js migrate:rollback --all
npx knex --knexfile ./src/db/knexfile.js migrate:latest
