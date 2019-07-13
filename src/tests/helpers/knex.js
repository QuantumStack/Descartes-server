/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const knex = require('knex');
const knexConfig = require('./../../db/knexfile').development;

knexConfig.migrations = {
  directory: './src/db/migrations',
};

knexConfig.seeds = {
  directory: './src/db/seeds',
};

module.exports = knex(knexConfig);
