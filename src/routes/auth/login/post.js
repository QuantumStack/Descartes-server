const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('./../../../config');

const router = express.Router();

/**
 * POST /auth/login
 *
 * Logs a user in and sends them a JWT.
 */
router.post('/', (req, res) => {
  const { email, password } = req.body;

  // Ensure that an email and password exists
  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'no-email',
      message: 'Please provide an email address.',
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      error: 'no-password',
      message: 'Please provide a password',
    });
  }

  return passport.authenticate('login', (err, user) => {
    if (err) {
      // If our strategy tell us that we have an incorrect credentials error,
      // let's let the user know.
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(400).json({
          success: false,
          error: 'incorrect-credentials',
          message: err.message,
        });
      }

      // We don't know what other error can come out, so let's not deal with that.
      throw err;
    }

    if (!user.is_email_verified) {
      return res.status(400).json({
        success: false,
        error: 'unverified-email',
        message: 'Please verify your email address before logging in.',
      });
    }

    // Let's create a JWT token now.
    const payload = {
      sub: user.id,
    };

    const token = jwt.sign(payload, config.auth.secret, { expiresIn: '60d' });

    // Otherwise, since there is no error, the user can successfully login.
    return res.json({
      success: true,
      message: 'You have successfully logged in.',
      token,
    });
  })(req, res);
});

module.exports = router;
