const { describe } = require('mocha');

const request = require('supertest');
const app = require('../../app');

const knex = require('./../helpers/knex');


// handles health check for server
module.exports = describe('GET /', () => {
  before(() => knex.migrate.rollback()
    .then(() => knex.migrate.latest()));

  it('Test Health of API Server', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200, {
        success: true,
        message: "Wow, look at you peeking around the API server. We're always looking for help at https://github.com/quantumstack, feel free to contact us!",
      }, done);
  });
});
