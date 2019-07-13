/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const PassportLocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');

const User = require('./../../models/User');

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
    User.query()
      .findOne('email', email.trim())
      .then(user => {
        // If we can't find the user, IncorrectCredentialsError
        if (!user) {
          const error = new Error('Incorrect email or password.');
          error.name = 'IncorrectCredentialsError';

          return done(error);
        }

        return bcrypt
          .compare(password, user.getPassword())
          .then(passwordValid => {
            if (!passwordValid) {
              const error = new Error('Incorrect email or password.');
              error.name = 'IncorrectCredentialsError';

              return done(error);
            }

            // Since the user is logging in, we will update their last login time.
            return user
              .$query()
              .update({ last_login: new Date() })
              .then(() => done(null, user))
              .catch(patchErr => done(patchErr));
          })
          .catch(bcryptErr => done(bcryptErr));
      });
  }
);
