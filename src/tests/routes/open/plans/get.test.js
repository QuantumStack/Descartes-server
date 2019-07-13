/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const { describe } = require('mocha');

const request = require('supertest');
const app = require('./../../../../app');

const knex = require('./../../../helpers/knex');

// Health Check for server before other tests commence.
describe('GET /open/plans', () => {
  before(() => knex.seed.run());

  it('200 OK', done => {
    request(app)
      .get('/open/plans')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        if (!('coursePlans' in res.body)) {
          return done(new Error('Course plans not in response.'));
        }

        return done();
      });
  });
});
