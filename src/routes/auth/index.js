const express = require('express');

const router = express.Router();

const loginRouter = require('./login');
const resendRouter = require('./resend');
const signupRouter = require('./signup');
const verifyRouter = require('./verify');

router.use('/login', loginRouter);
router.use('/resend', resendRouter);
router.use('/signup', signupRouter);
router.use('/verify', verifyRouter);

module.exports = router;
