/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const express = require('express');

const CoursePlan = require('./../../../models/CoursePlan');

const router = express.Router();

/* GET home page with authentication */
router.get('/', (req, res) => {
  return CoursePlan.query().then(coursePlans => {
    return res.status(200).json({
      success: true,
      coursePlans: coursePlans.map(coursePlan => {
        const retCoursePlan = coursePlan;
        delete retCoursePlan.id;
        return retCoursePlan;
      }),
    });
  });
});

module.exports = router;
