/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const { describe } = require('mocha');

const request = require('supertest');
const app = require('./../../../../../app');

const User = require('./../../../../../models/User');
const CoursePlan = require('./../../../../../models/CoursePlan');

const getJWT = require('./../../../../helpers/getJWT');

require('./../../../get.test');
require('./../../get.test');
require('./../../../open/plans/get.test');

describe('POST /api/course/create', () => {
  let jwt;
  before(done => {
    getJWT('aditya@example.com').then(receivedJWT => {
      jwt = receivedJWT;
      done();
    });
  });

  it('200 Payment Portal Skipped (Administrator)', done => {
    CoursePlan.query()
      .where('plan_name', 'standard')
      .first()
      .then(result => result.uuid)
      .then(courseUUID => {
        // Let's first set us to be an admin
        User.query()
          .update({ is_admin: true })
          .where('email', 'aditya@example.com')
          .then(() => {
            request(app)
              .post('/api/course/create')
              .set('Authorization', `bearer ${jwt}`)
              .send({
                name:
                  '15-122: Principles of Imperative Computation - Fall 2019',
                description: 'An introduction to imperative programming.',
                plan: courseUUID,
                price: 200,
              })
              .expect('Content-Type', /json/)
              .expect(
                200,
                {
                  success: true,
                  isFree: true,
                },
                done
              );
          });
      });
  });

  it('200 Redirect to Stripe', done => {
    done();
  });
});
