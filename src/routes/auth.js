const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('./../models/User');
const EmailVerificationTokens = require('./../models/EmailVerificationToken');

const confirmationEmailSender = require('./../util/email_verification/sender');
const verifyRecaptcha = require('./../util/auth/verify-recaptcha');

const config = require('./../config');

/**
 * POST /auth/login
 *
 * Logs a user in and sends them a JWT.
 */
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

      // If there is some other generic issue, return a 400 error and a generic
      // error message.
      return res.status(400).json({
        success: false,
        error: 'unknown-error',
        message: 'Could not process the form.',
      });
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

/**
 * POST /auth/signup
 *
 * Creates a user account and sends a confirmation email.
 */
router.post('/signup', (req, res, next) => {
  const {
    email, password, firstName, lastName,
  } = req.body;

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

  if (!firstName || !lastName) {
    return res.status(400).json({
      success: false,
      error: 'no-name',
      message: 'Please provide both your first and last name.',
    });
  }

  const recaptchaResponse = req.body['g-recaptcha-response'] || '';

  if (config.recaptcha.enabled && !req.body['g-recaptcha-response']) {
    return res.status(400).json({
      success: false,
      error: 'invalid-recaptcha',
      message: 'The reCAPTCHA verification failed, please try again.',
    });
  }

  return verifyRecaptcha(recaptchaResponse.trim(),
    (recaptchaSuccess) => {
      if (!recaptchaSuccess) {
        return res.status(400).json({
          success: false,
          error: 'invalid-recaptcha',
          message: 'The reCAPTCHA verification failed, please try again.',
        });
      }

      // Now, let's try our passport local signup strategy.
      return passport.authenticate('register', (err, user) => {
        // TODO: Fix the user already exists logic.
        if (err) {
          return res.status(409).json({
            success: false,
            error: 'user-already-exists',
            message: 'A user with this email address already exists.',
          });
        }

        // Let's now create the user's profile
        user.$relatedQuery('profile').insert({
          first_name: firstName,
          last_name: lastName,
        })
          .then(() => confirmationEmailSender(user)
            .finally(() => res.status(200).json({
              success: true,
              message: 'You have successfully created an account.',
            })));
      })(req, res, next);
    });
});


/**
 * POST /auth/verify
 *
 * Confirms a user's email using the token they received.
 */
router.post('/verify', (req, res) => {
  const { email, confirmationId } = req.body;

  if (!email || !confirmationId) {
    return res.status(400).json({
      success: false,
      error: 'no-email-or-confirmationid',
      message: 'Please enter your email and confirmation id.',
    });
  }
  return User.query().findOne('email', email.trim())
    .then((user) => {
      // Check whether this user exists in the first place.
      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'invalid-email-confirmation',
          message: 'Your email has not been verified.',
        });
      }

      // Now, let's check whether the user is verified or not.
      if (user.is_email_verified) {
        return res.status(400).json({
          success: false,
          error: 'invalid-email-confirmation',
          message: 'Your email has already been verified!',
        });
      }

      // Since the user exists, try to find a valid verification token matching
      // the data that was sent.
      return EmailVerificationTokens.query().findOne({
        user_id: user.id,
        token: confirmationId.trim(),
      })
        .then((token) => {
          if (!token) {
            return res.status(400).json({
              success: false,
              error: 'invalid-email-confirmation',
              message: 'Your email has not been verified.',
            });
          }

          // Now, let's verify the user.
          return user.$query().patch({ is_email_verified: true })
            .then(() => {
              // After we modified the user, let's delete the token and send
              // the user a success status.
              token.$query().delete()
                .then(() => res.status(200).json({
                  success: true,
                  message: 'Your email has been successfully verified.',
                }));
            });
        });
    });
});


/**
 * POST /auth/resend
 *
 * Requests a confirmation email to be sent again.
 */
router.post('/resend', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'no-email',
      message: 'You must provide an email address.',
    });
  }

  User.query().findOne('email', email.trim())
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'non-existent-email',
          message: 'An account with this email address does not exist, try signing up first.',
        });
      }

      if (user.is_email_verified) {
        return res.status(400).json({
          success: false,
          error: 'email-already-verified',
          message: 'This email has already been verified.',
        });
      }

      return confirmationEmailSender(user).then((error) => {
        if (error && error.name === 'email-verification-too-quickly') {
          return res.status(400).json({
            success: false,
            error: 'email-verification-too-quickly',
            message: 'You have already requested an email verification recently.',
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Another confirmation email has been successfully sent.',
        });
      });
    });
});

module.exports = router;
