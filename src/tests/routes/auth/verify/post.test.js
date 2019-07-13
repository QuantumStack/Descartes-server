/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const { describe } = require('mocha');

const request = require('supertest');
const app = require('./../../../../app');

const EmailVerificationToken = require('./../../../../models/EmailVerificationToken');
const User = require('./../../../../models/User');

require('./../../get.test');
require('./../login/post.test');

const POST_VERIFY_URL = '/auth/verify';

describe('POST /auth/verify', () => {
  beforeEach(() =>
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
      .then(() =>
        User.query()
          .update({ is_email_verified: false })
          .where('email', 'aditya@example.com')
      )
  );

  it('200 Valid Email Confirmation', done => {
    request(app)
      .post(POST_VERIFY_URL)
      .send({
        email: 'aditya@example.com',
        confirmationId: 'abc',
      })
      .expect('Content-Type', /json/)
      .expect(
        200,
        {
          success: true,
          message: 'Your email has been successfully verified.',
        },
        done
      );
  });

  it('400 Invalid Email Confirmation', done => {
    request(app)
      .post(POST_VERIFY_URL)
      .send({
        email: 'invalid-email@example.com',
        confirmationId: 'abc',
      })
      .expect('Content-Type', /json/)
      .expect(
        400,
        {
          success: false,
          error: 'invalid-email-confirmation',
          message: 'Your email has not been verified.',
        },
        done
      );
  });

  it('400 Invalid Confirmation ID', done => {
    request(app)
      .post(POST_VERIFY_URL)
      .send({
        email: 'aditya@example.com',
        confirmationId: 'bad',
      })
      .expect('Content-Type', /json/)
      .expect(
        400,
        {
          success: false,
          error: 'invalid-email-confirmation',
          message: 'Your email has not been verified.',
        },
        done
      );
  });

  it('400 Email Already Verified', done => {
    User.query()
      .update({ is_email_verified: true })
      .where('email', 'aditya@example.com')
      .then(() => {
        request(app)
          .post(POST_VERIFY_URL)
          .send({
            email: 'aditya@example.com',
            confirmationId: 'abc',
          })
          .expect('Content-Type', /json/)
          .expect(
            400,
            {
              success: false,
              error: 'invalid-email-confirmation',
              message: 'Your email has already been verified!',
            },
            done
          );
      });
  });
});
