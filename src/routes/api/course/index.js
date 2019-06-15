const express = require('express');

const router = express.Router();

const createRouter = require('./create');
const enrollRouter = require('./enroll');
const overviewRouter = require('./overview');

router.use('/create', createRouter);
router.use('/enroll', enrollRouter);
router.use('/overview', overviewRouter);

module.exports = router;
