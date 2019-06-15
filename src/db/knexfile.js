const logger = require('./../util/logger');
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
    pool: {
      afterCreate: (conn, done) =>
        conn.query('SET timezone="UTC";', err => {
          if (err) {
            logger.log({
              level: 'warn',
              message: 'Could not set timezone to UTC...',
            });
            return done(err);
          }
          return done(null);
        }),
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
      afterCreate: (conn, done) =>
        conn.query('SET timezone="UTC";', err => {
          if (err) {
            logger.log({
              level: 'warn',
              message: 'Could not set timezone to UTC...',
            });
            return done(err);
          }
          return done(null);
        }),
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
