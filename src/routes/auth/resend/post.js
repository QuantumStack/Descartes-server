const express = require('express');

const User = require('./../../../models/User');

const confirmationEmailSender = require('./../../../util/email_verification/sender');

const router = express.Router();

/**
 * POST /auth/resend
 *
 * Requests a confirmation email to be sent again.
 */
router.post('/', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'no-email',
      message: 'You must provide an email address.',
    });
  }

  return User.query()
    .findOne('email', email.trim())
    .then(user => {
      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'non-existent-email',
          message:
            'An account with this email address does not exist, try signing up first.',
        });
      }

      if (user.is_email_verified) {
        return res.status(400).json({
          success: false,
          error: 'email-already-verified',
          message: 'This email has already been verified.',
        });
      }

      return confirmationEmailSender(user).then(error => {
        if (error && error.name === 'email-verification-too-quickly') {
          return res.status(400).json({
            success: false,
            error: 'email-verification-too-quickly',
            message:
              'You have already requested an email verification recently.',
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
