const { describe } = require('mocha');

const request = require('supertest');
const app = require('../../../../app');

const config = require('../../../../config');
const EmailVerificationToken = require('../../../../models/EmailVerificationToken');
const User = require('../../../../models/User');

require('./../../GET');
require('./../login/POST');

const POST_RESEND_URL = '/auth/resend';

describe('POST /auth/resend', () => {
  beforeEach(() =>
    EmailVerificationToken.query()
      .select('*')
      .delete()
      .then(() =>
        User.query()
          .update({ is_email_verified: false })
          .where('email', 'aditya@example.com')
      )
  );

  it('200 Valid Email Confirmation Resend', done => {
    request(app)
      .post(POST_RESEND_URL)
      .send({
        email: 'aditya@example.com',
      })
      .expect('Content-Type', /json/)
      .expect(
        200,
        {
          success: true,
          message: 'Another confirmation email has been successfully sent.',
        },
        done
      );
  });

  it('400 Requesting Verification Too Quickly', done => {
    EmailVerificationToken.query()
      .select('*')
      .delete()
      .then(() =>
        EmailVerificationToken.query().insert({
          id: 1,
          token: 'abc',
          user_id: 1,
        })
      )
      .then(() => {
        request(app)
          .post(POST_RESEND_URL)
          .send({
            email: 'aditya@example.com',
          })
          .expect('Content-Type', /json/)
          .expect(
            400,
            {
              success: false,
              error: 'email-verification-too-quickly',
              message:
                'You have already requested an email verification' +
                ' recently.',
            },
            done
          );
      });
  });

  it('200 Requesting New Token between Expiration and Deletion', done => {
    EmailVerificationToken.query()
      .insert({ id: 1, token: 'abc', user_id: 1 })
      .then(() => {
        setTimeout(() => {
          request(app)
            .post(POST_RESEND_URL)
            .send({
              email: 'aditya@example.com',
            })
            .expect('Content-Type', /json/)
            .expect(200, {
              success: true,
              message: 'Another confirmation email has been successfully sent.',
            })
            .end(err => {
              if (err) return done(err);
              return EmailVerificationToken.query()
                .select('*')
                .then(results => {
                  if (results.length !== 2) {
                    done(new Error('Deleted a token before it should have.'));
                  } else {
                    done();
                  }
                });
            });
        }, config.email_verification_token.delay_time * 1000);
      });
  }).timeout(config.email_verification_token.delay_time * 1000 + 2000);

  it('OTHER Verify Automatic Deletion', done => {
    EmailVerificationToken.query()
      .insert({ id: 1, token: 'abc', user_id: 1 })
      .then(() => {
        setTimeout(() => {
          EmailVerificationToken.query()
            .select('*')
            .then(results => {
              if (results.length !== 0) {
                done(new Error('Did not delete token.'));
              } else {
                done();
              }
            });
        }, config.email_verification_token.expiry_time * 1000);
      });
  }).timeout(config.email_verification_token.expiry_time * 1000 + 2000);

  it('400 Email Already Verified', done => {
    User.query()
      .update({ is_email_verified: true })
      .where('email', 'aditya@example.com')
      .then(() => {
        request(app)
          .post(POST_RESEND_URL)
          .send({
            email: 'aditya@example.com',
          })
          .expect('Content-Type', /json/)
          .expect(
            400,
            {
              success: false,
              error: 'email-already-verified',
              message: 'This email has already been verified.',
            },
            done
          );
      });
  });

  it('400 Invalid Email Confirmation Resend', done => {
    request(app)
      .post(POST_RESEND_URL)
      .send({
        email: 'non-existent@example.com',
      })
      .expect('Content-Type', /json/)
      .expect(
        400,
        {
          error: 'non-existent-email',
          message:
            'An account with this email address does not exist, try signing up first.',
          success: false,
        },
        done
      );
  });
});
