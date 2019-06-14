const { describe } = require('mocha');

const request = require('supertest');
const app = require('../../../../app');
const User = require('./../../../../models/User');

require('./../signup/POST');

describe('POST /auth/login', () => {
  it('400 Unverified Email', (done) => {
    request(app)
      .post('/auth/login')
      .send({
        email: 'aditya@example.com',
        password: 'example_password',
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        success: false,
        error: 'unverified-email',
        message: 'Please verify your email address before logging in.',
      }, done);
  });
});
