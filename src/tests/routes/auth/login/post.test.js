/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const { describe } = require('mocha');

const request = require('supertest');
const app = require('./../../../../app');
const User = require('./../../../../models/User');

require('./../../get.test');
require('./../signup/post.test');

const POST_LOGIN_URL = '/auth/login';

describe('POST /auth/login', () => {
  before(done => {
    // Manually verify the user 'aditya@example.com'
    User.query()
      .update({ is_email_verified: true })
      .where('email', 'aditya@example.com')
      .then(() => {
        done();
      });
  });

  it('200 Valid Login', done => {
    request(app)
      .post(POST_LOGIN_URL)
      .send({
        email: 'aditya@example.com',
        password: 'example_password',
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        if (!res.body.success)
          throw new Error('Returned unsuccessful on successful login.');
        if (res.body.message !== 'You have successfully logged in.')
          throw new Error('Invalid message.');
        if (!('token' in res.body))
          throw new Error('Token not found in response.');
        done();
      });
  });

  it('400 Email Not Provided', done => {
    request(app)
      .post(POST_LOGIN_URL)
      .send({
        password: 'example_password',
      })
      .expect('Content-Type', /json/)
      .expect(
        400,
        {
          success: false,
          error: 'no-email',
          message: 'Please provide an email address.',
        },
        done
      );
  });

  it('400 Password Not Provided', done => {
    request(app)
      .post(POST_LOGIN_URL)
      .send({
        email: 'aditya@example.com',
      })
      .expect('Content-Type', /json/)
      .expect(
        400,
        {
          success: false,
          error: 'no-password',
          message: 'Please provide a password',
        },
        done
      );
  });

  it('400 Incorrect Email', done => {
    request(app)
      .post(POST_LOGIN_URL)
      .send({
        email: 'nonexistent-user@example.com',
        password: 'example_password',
      })
      .expect('Content-Type', /json/)
      .expect(
        400,
        {
          success: false,
          error: 'incorrect-credentials',
          message: 'Incorrect email or password.',
        },
        done
      );
  });

  it('400 Incorrect Password', done => {
    request(app)
      .post(POST_LOGIN_URL)
      .send({
        email: 'aditya@example.com',
        password: 'incorrect_password',
      })
      .expect('Content-Type', /json/)
      .expect(
        400,
        {
          success: false,
          error: 'incorrect-credentials',
          message: 'Incorrect email or password.',
        },
        done
      );
  });

  it('400 Unverified Email', done => {
    User.query()
      .update({ is_email_verified: false })
      .where('email', 'aditya@example.com')
      .then(() => {
        request(app)
          .post(POST_LOGIN_URL)
          .send({
            email: 'aditya@example.com',
            password: 'example_password',
          })
          .expect('Content-Type', /json/)
          .expect(
            400,
            {
              success: false,
              error: 'unverified-email',
              message: 'Please verify your email address before logging in.',
            },
            done
          );
      });
  });
});