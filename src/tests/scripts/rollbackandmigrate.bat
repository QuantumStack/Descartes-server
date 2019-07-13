REM COPYRIGHT (c) 2019, QuantumStack. All rights reserved.

REM Rollback then migrate

call npx knex --cwd ./src/db migrate:rollback --all
call npx knex --cwd ./src/db migrate:latest
