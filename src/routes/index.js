var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => res.status(200).json({
  success: true,
  message: 'Wow, look at you peeking around the API server. We\'re always'
    + ' looking for help at https://github.com/quantumstack, feel free to'
    + ' contact us!',
}));

module.exports = router;
