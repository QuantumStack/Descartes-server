/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const express = require('express');
const passport = require('passport');

const router = express.Router();

const authRouter = require('./auth');
const apiRouter = require('./api');
const openRouter = require('./open');

/* GET home page. */
router.get('/', (req, res) =>
  res.status(200).json({
    success: true,
    message:
      "Wow, look at you peeking around the API server. We're always" +
      ' looking for help at https://github.com/quantumstack, feel free to' +
      ' contact us!',
  })
);

router.use('/auth', authRouter);
router.use('/open', openRouter);
router.use(
  '/api',
  passport.authenticate('jwt', {
    session: false,
  }),
  apiRouter
);

module.exports = router;
