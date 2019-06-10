const express = require('express');

const router = express.Router();

const courseRouter = require('./apiv1/course');

router.use('/course', courseRouter);

/* GET home page with authentication */
router.get('/', (req, res) => {
  req.user.$relatedQuery('profile').then(prof => res.status(200)
    .json({
      success: true,
      message: `Hey ${prof.first_name}! You seem like you know what you're`
        + ' doing poking around the API. Check us out at'
        + ' https://quantumstack.xyz',
    }));
});

module.exports = router;
