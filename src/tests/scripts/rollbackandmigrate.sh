#!/usr/bin/env bash

# Rollback then migrate
npx knex --cwd ./src/db migrate:rollback --all
npx knex --cwd ./src/db migrate:latest
