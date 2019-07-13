/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const express = require('express');

const router = express.Router();

const plansRouter = require('./plans');

router.use('/plans', plansRouter);

module.exports = router;
