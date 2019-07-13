/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const PassportJwtStrategy = require('passport-jwt').Strategy;
const PassportExtractJwt = require('passport-jwt').ExtractJwt;

const config = require('./../../config');

const User = require('./../../models/User');

const opts = {
  jwtFromRequest: PassportExtractJwt.fromAuthHeaderWithScheme('bearer'),
  secretOrKey: config.auth.secret,
};

/**
 * Return the Passport JWT Strategy object.
 */
module.exports = new PassportJwtStrategy(opts, (jwtPayload, done) =>
  User.query()
    .findById(jwtPayload.sub)
    .then(user => {
      if (!user) {
        const error = new Error('Incorrect email or password.');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      return user
        .$query()
        .patch({ last_login: new Date() })
        .then(() => done(null, user));
    })
    .catch(err => done(err))
);
