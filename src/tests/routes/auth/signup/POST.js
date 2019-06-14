const { describe } = require('mocha');

const request = require('supertest');
const app = require('../../../../app');
const knex = require('../../../helpers/knex');

require('./../../GET');

describe('POST /auth/signup', () => {
  before((done) => {
    knex.migrate.rollback()
      .then(() => {
        console.log('Finished rollback...');
        return knex.migrate.latest();
      })
      .then(() => {
        console.log('Finished migrations...');
        done();
      });
  });

  it('200 Valid Signup', (done) => {
    request(app)
      .post('/auth/signup')
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
});
