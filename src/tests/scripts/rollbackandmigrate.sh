#!/usr/bin/env bash

#
# COPYRIGHT (c) 2019, QUANTUMSTACK. ALL RIGHTS RESERVED.
#

# Rollback then migrate
npx knex --cwd ./src/db migrate:rollback --all
npx knex --cwd ./src/db migrate:latest

# Seed
npx knex --cwd ./src/db seed:run
