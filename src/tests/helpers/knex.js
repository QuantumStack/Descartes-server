const knex = require('knex');
const knexConfig = require('./../../db/knexfile').development;

knexConfig.migrations = {
  directory: './src/db/migrations',
};

module.exports = knex(knexConfig);
