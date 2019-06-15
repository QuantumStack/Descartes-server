const express = require('express');

const router = express.Router();

const postRouter = require('./post');

router.post('/', postRouter);

module.exports = router;
