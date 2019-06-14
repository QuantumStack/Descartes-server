const express = require('express');

const router = express.Router();

const authRouter = require('./auth');

/* GET home page. */
router.get('/', (req, res) => res.status(200).json({
  success: true,
  message: 'Wow, look at you peeking around the API server. We\'re always'
    + ' looking for help at https://github.com/quantumstack, feel free to'
    + ' contact us!',
}));

router.use('/auth', authRouter);

module.exports = router;
