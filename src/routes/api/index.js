/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const express = require('express');

const router = express.Router();

const getRouter = require('./get');

const courseRouter = require('./course');

router.use('/course', courseRouter);

router.get('/', getRouter);

module.exports = router;
