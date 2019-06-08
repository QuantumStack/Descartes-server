
const PassportJwtStrategy = require('passport-jwt').Strategy;
const PassportExtractJwt = require('passport-jwt').ExtractJwt;

const config = require('./../../config');

const User = require('../../models/User');


const opts = {
  jwtFromRequest: PassportExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: config.auth.secret,
};

/**
 * Return the Passport JWT Strategy object.
 */
module.exports = new PassportJwtStrategy(opts, (jwtPayload, done) => {
  User.query().findOne('email', jwtPayload.id)
    .then((user) => {
      if (!user) {
        const error = new Error('Incorrect email or password.');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      return done(null, user);
    })
    .catch(err => done(err));
});
