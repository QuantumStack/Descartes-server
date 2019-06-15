const { describe } = require('mocha');

const request = require('supertest');
const app = require('../../../../app');
const knex = require('../../../helpers/knex');

require('./../../GET');

const POST_SIGNUP_URL = '/auth/signup';

describe('POST /auth/signup', () => {
  before((done) => {
    knex.migrate.rollback()
      .then(() => knex.migrate.latest())
      .then(() => {
        done();
      });
  });

  it('200 Valid Signup (with reCAPTCHA)', (done) => {
    request(app)
      .post(POST_SIGNUP_URL)
      .send({
        email: 'aditya@example.com',
        password: 'example_password',
        firstName: 'Aditya',
        lastName: 'Pillai',
        'g-recaptcha-response': 'recaptcha-token',
      })
      .expect('Content-Type', /json/)
      .expect(200, {
        success: true,
        message: 'You have successfully created an account.',
      }, done);
  });

  it('200 Valid Signup (without reCAPTCHA)', (done) => {
    request(app)
      .post(POST_SIGNUP_URL)
      .send({
        email: 'aditya_2@example.com',
        password: 'different_password',
        firstName: 'Aditya',
        lastName: 'Pillai',
        'g-recaptcha-response': 'disabled',
      })
      .expect('Content-Type', /json/)
      .expect(200, {
        success: true,
        message: 'You have successfully created an account.',
      }, done);
  });

  it('409 User Account Already Exists', (done) => {
    request(app)
      .post(POST_SIGNUP_URL)
      .send({
        email: 'aditya@example.com',
        password: 'example_password',
        firstName: 'Aditya',
        lastName: 'Pillai',
        'g-recaptcha-response': 'recaptcha-token',
      })
      .expect('Content-Type', /json/)
      .expect(409, {
        success: false,
        error: 'user-already-exists',
        message: 'A user with this email address already exists.',
      }, done);
  });

  it('400 Password Too Short', (done) => {
    request(app)
      .post(POST_SIGNUP_URL)
      .send({
        email: 'aditya@example.com',
        password: 'short',
        firstName: 'Aditya',
        lastName: 'Pillai',
        'g-recaptcha-response': 'recaptcha-token',
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        success: false,
        error: 'password-too-short',
        message: 'Please provide a password of length 8+.',
      }, done);
  });

  it('400 Email Not Provided', (done) => {
    request(app)
      .post(POST_SIGNUP_URL)
      .send({
        password: 'example_password',
        firstName: 'Aditya',
        lastName: 'Pillai',
        'g-recaptcha-response': 'recaptcha-token',
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        success: false,
        error: 'no-email',
        message: 'Please provide your email.',
      }, done);
  });

  it('400 Password Not Provided', (done) => {
    request(app)
      .post(POST_SIGNUP_URL)
      .send({
        email: 'aditya@example.com',
        firstName: 'Aditya',
        lastName: 'Pillai',
        'g-recaptcha-response': 'recaptcha-token',
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        success: false,
        error: 'no-password',
        message: 'Please provide a password',
      }, done);
  });

  it('400 Name Not Provided', (done) => {
    request(app)
      .post(POST_SIGNUP_URL)
      .send({
        email: 'aditya@example.com',
        password: 'example_password',
        'g-recaptcha-response': 'recaptcha-token',
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        success: false,
        error: 'no-name',
        message: 'Please provide both your first and last name.',
      }, done);
  });
});
