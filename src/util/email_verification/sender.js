const EmailVerificationToken = require('./../../models/EmailVerificationToken');
const emailer = require('./../emailer');

const logger = require('./../logger');

const tokenGenerator = require('./generator');

const config = require('./../../config');
const delayTime = require('./../../config').email_verification_token.delay_time;

module.exports = user => EmailVerificationToken.query()
  .where({
    user_id: user.id,
  })
  .orderBy('created_at', 'desc')
  .first()
  .then((t) => {
    if (t && Date.now() - t.created_at < delayTime * 1000) {
      const error = new Error('You have already requested an email verification'
        + ' recently.');
      error.name = 'email-verification-too-quickly';

      return error;
    }

    // Since they haven't requested a email verification for a while, let's give
    // it to them.
    return tokenGenerator(user).then((token) => {
      const message = {
        from: `Descartes <${config.email.smtp_user}>`,
        to: user.email,
        subject: 'Verify your Descartes account!',
        html: `
        Have fun, here is your code ${token}
      `,
      };

      emailer.sendMail(message).catch((err) => {
        logger.log({
          level: 'error',
          message: err.message,
        });
      });
    });
  });
