/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const express = require('express');

const Coupon = require('./../../../../../models/Coupon');

const router = express.Router();

/** GET /api/course/create/coupon?code={coupon_code}
 *
 * Verifying authenticity of coupons.
 */
router.get('/', (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({
      success: false,
      error: 'no-coupon',
      message: 'Please provide a coupon code.',
    });
  }

  return Coupon.query()
    .where('coupon_code', code)
    .first()
    .then(coupon => {
      if (!coupon) {
        return res.status(404).json({
          success: true,
          verified: false,
        });
      }

      return res.status(200).json({
        success: true,
        verified: true,
        plan: coupon.plan_uuid,
        adjustedPrice: coupon.adjusted_price,
      });
    });
});

module.exports = router;
