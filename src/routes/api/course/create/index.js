/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const express = require('express');

const router = express.Router();

const postRouter = require('./post');
const couponRouter = require('./coupon');

router.post('/', postRouter);
router.use('/coupon', couponRouter);

module.exports = router;
