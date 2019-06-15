const express = require('express');

const router = express.Router();

const User = require('./../../../models/User');
const EmailVerificationTokens = require('./../../../models/EmailVerificationToken');

/**
 * POST /auth/verify
 *
 * Confirms a user's email using the token they received.
 */
router.post('/', (req, res) => {
  const { email, confirmationId } = req.body;

  if (!email || !confirmationId) {
    return res.status(400).json({
      success: false,
      error: 'no-email-or-confirmationid',
      message: 'Please enter your email and confirmation id.',
    });
  }
  return User.query()
    .findOne('email', email.trim())
    .then(user => {
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
      return EmailVerificationTokens.query()
        .findOne({
          user_id: user.id,
          token: confirmationId.trim(),
        })
        .then(token => {
          if (!token) {
            return res.status(400).json({
              success: false,
              error: 'invalid-email-confirmation',
              message: 'Your email has not been verified.',
            });
          }

          // Now, let's verify the user.
          return user
            .$query()
            .patch({ is_email_verified: true })
            .then(() => {
              // After we modified the user, let's delete the token and send
              // the user a success status.
              token
                .$query()
                .delete()
                .then(() =>
                  res.status(200).json({
                    success: true,
                    message: 'Your email has been successfully verified.',
                  })
                );
            });
        });
    });
});

module.exports = router;
