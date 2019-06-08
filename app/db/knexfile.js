
const config = require('./../config');

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host: config.db.development.host,
      port: config.db.development.port,
      database: config.db.development.name,
      user: config.db.development.user,
      password: config.db.development.pass,
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      host: config.db.production.host,
      port: config.db.production.port,
      database: config.db.production.name,
      user: config.db.production.user,
      password: config.db.production.pass,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

};
