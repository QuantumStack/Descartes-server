const { describe } = require('mocha');

const request = require('supertest');
const app = require('../../../app');

const getJWT = require('./../../helpers/getJWT');

require('./../GET');
require('./../auth/signup/POST');
require('./../auth/login/POST');

const GET_API_URL = '/api';

describe('GET /api/', () => {
  let jwt = null;

  before((done) => {
    getJWT('aditya@example.com')
      .then((receivedJWT) => {
        jwt = receivedJWT;
        done();
      });
  });

  it('200 Authentication Verified', (done) => {
    request(app)
      .get(GET_API_URL)
      .set('Authorization', `Bearer ${jwt}`)
      .expect('Content-Type', /json/)
      .expect(200, {
        success: true,
        message: 'Hey Aditya! You seem like you know what you\'re'
          + ' doing poking around the API. Check us out at'
          + ' https://quantumstack.xyz',
      }, done);
  });

  it('401 Unauthorized No Token', (done) => {
    request(app)
      .get(GET_API_URL)
      .expect(401, done);
  });

  it('401 Unauthorized Invalid Token', (done) => {
    request(app)
      .get(GET_API_URL)
      .set('Authorization', 'Bearer invalid_token')
      .expect(401, done);
  });
});
