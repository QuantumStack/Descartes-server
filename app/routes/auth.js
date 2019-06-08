const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const config = require('./../config');

router.post('/login', (req, res) => {
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

      console.log(`Error: ${err}`);

      // If there is some other generic issue, return a 400 error and a generic
      // error message.
      return res.status(400).json({
        success: false,
        error: 'unknown-error',
        message: 'Could not process the form.',
      });
    }

    // if (!user.isEmailVerified) {
    //   return res.status(400).json({
    //     success: false,
    //     error: 'unverified-email',
    //     message: 'Please verify your email address before logging in.',
    //   });
    // }

    // Let's create a JWT token now.
    const payload = {
      sub: user.id,
    };

    const token = jwt.sign(payload, config.auth.secret);

    // Otherwise, since there is no error, the user can successfully login.
    return res.json({
      success: true,
      message: 'You have successfully logged in.',
      token,
      user,
    });
  })(req, res);
});

router.post('/signup', (req, res, next) => {
  const { email, password } = req.body;

  // If a field is missing, alert the user.
  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'no-email',
      message: 'Please provide your email.',
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      error: 'no-password',
      message: 'Please provide a password',
    });
  }

  if (password.trim().length < 8) {
    return res.status(400).json({
      success: false,
      error: 'password-too-short',
      message: 'Please provide a password of length 8+.',
    });
  }

  // Now, let's try our passport local signup strategy.
  return passport.authenticate('register', (err) => {
    // TODO: Fix the user already exists logic.
    if (err) {
      console.log(`Error: ${err}`);

      return res.status(409).json({
        success: false,
        error: 'user-already-exists',
        message: 'A user with this email address already exists.',
      });
    }

    // Alert the user that the account has successfully been created.
    return res.status(200).json({
      success: true,
      message: 'You have successfully created an account.',
    });
  })(req, res, next);
});

module.exports = router;
