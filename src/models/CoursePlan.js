/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

/* eslint-disable global-require */

const { Model } = require('objection');

class CoursePlan extends Model {
  // Define the table name
  static get tableName() {
    return 'course_plans';
  }

  // Define relations
  static get relationMappings() {
    const Coupon = require('./Coupon');

    return {
      coupons: {
        relation: Model.HasManyRelation,
        modelClass: Coupon,
        join: {
          from: 'course_plans.uuid',
          to: 'coupons.plan_uuid',
        },
      },
    };
  }
}

module.exports = CoursePlan;
