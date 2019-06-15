const express = require('express');
const passport = require('passport');

const confirmationEmailSender = require('./../../../util/email_verification/sender');
const verifyRecaptcha = require('./../../../util/auth/verify-recaptcha');

const config = require('./../../../config');

const router = express.Router();

/**
 * POST /auth/signup
 *
 * Creates a user account and sends a confirmation email.
 */
router.post('/', (req, res, next) => {
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
      error: 'no-recaptcha',
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
        return user.$relatedQuery('profile').insert({
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

module.exports = router;
