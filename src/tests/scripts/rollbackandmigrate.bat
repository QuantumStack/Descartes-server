REM Rollback then migrate

call npx knex --knexfile ./src/db/knexfile.js migrate:rollback --all
call npx knex --knexfile ./src/db/knexfile.js migrate:latest
