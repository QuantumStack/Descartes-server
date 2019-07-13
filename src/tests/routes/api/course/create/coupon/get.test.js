/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const { describe } = require('mocha');

const request = require('supertest');
const app = require('./../../../../../../app');

const CoursePlan = require('./../../../../../../models/CoursePlan');

const getJWT = require('./../../../../../helpers/getJWT');

require('./../../../../open/plans/get.test');
require('./../../../../auth/signup/post.test');

describe('GET /api/course/create/coupon?code={coupon_code}', () => {
  let jwt;
  before(done => {
    getJWT('aditya@example.com')
      .then(receivedJWT => {
        jwt = receivedJWT;
      })
      .then(() => CoursePlan.query().first())
      .then(coursePlan =>
        coursePlan
          .$relatedQuery('coupons')
          .insert({ coupon_code: 'super_discount', adjusted_price: 0 })
      )
      .then(() => done());
  });

  it('200 Valid Coupon', done => {
    request(app)
      .get('/api/course/create/coupon')
      .query({ code: 'super_discount' })
      .set('Authorization', `bearer ${jwt}`)
      .send()
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(new Error(err));
        }

        const { body } = res;
        if (!body.success) {
          return done(new Error('Expected successful result.'));
        }

        if (!body.verified) {
          return done(new Error('Expected coupon to be verified.'));
        }

        if (body.adjustedPrice !== 0) {
          return done(new Error('Invalid adjusted price.'));
        }

        return done();
      });
  });

  it('400 Coupon Not Provided', done => {
    request(app)
      .get('/api/course/create/coupon')
      .set('Authorization', `bearer ${jwt}`)
      .send()
      .expect('Content-Type', /json/)
      .expect(
        400,
        {
          success: false,
          error: 'no-coupon',
          message: 'Please provide a coupon code.',
        },
        done
      );
  });

  it('404 Invalid or Expired Coupon', done => {
    request(app)
      .get('/api/course/create/coupon')
      .query({ code: 'bad_coupon' })
      .set('Authorization', `bearer ${jwt}`)
      .send()
      .expect('Content-Type', /json/)
      .expect(
        404,
        {
          success: true,
          verified: false,
        },
        done
      );
  });
});
