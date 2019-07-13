/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const PassportLocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');

const User = require('./../../models/User');
const config = require('./../../config');

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
  },
  (req, email, password, done) => {
    bcrypt
      .genSalt(config.auth.salt_rounds)
      .then(salt =>
        bcrypt
          .hash(password.trim(), salt)
          .then(hashedPassword => {
            const userData = {
              email: email.trim(),
              password: hashedPassword,
            };

            User.query()
              .insert(userData)
              .then(user => done(null, user))
              .catch(err => done(err));
          })
          .catch(hashErr => done(hashErr))
      )
      .catch(saltErr => done(saltErr));
  }
);
