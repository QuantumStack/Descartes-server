/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

/* eslint-disable global-require */

const { Model } = require('objection');

class Coupon extends Model {
  // Define the table name
  static get tableName() {
    return 'coupons';
  }

  // Define relations
  static get relationMappings() {
    const CoursePlan = require('./CoursePlan');

    return {
      coursePlan: {
        relation: Model.BelongsToOneRelation,
        modelClass: CoursePlan,
        join: {
          from: 'coupons.plan_uuid',
          to: 'coursePlan.uuid',
        },
      },
    };
  }
}

module.exports = Coupon;
