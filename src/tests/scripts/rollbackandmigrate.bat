REM Rollback then migrate

call npx knex --cwd ./src/db migrate:rollback --all
call npx knex --cwd ./src/db migrate:latest
