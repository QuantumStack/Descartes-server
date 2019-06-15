const express = require('express');

const router = express.Router();

const config = require('./../../config');

const createCourse = require('./../../util/course/createCourse');
const studentEnrollWithCode = require('./../../util/course/studentEnrollWithCode');
const overviewHelper = require('./../../util/course/overviewHelpers');


/** POST /api/course/create
 *
 * Creating a course, redirect to stripe.
 */
router.post('/create', (req, res) => {
  const { name, description, plan } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'no-name',
      message: 'Please provide a course name.',
    });
  }

  if (!description) {
    return res.status(400).json({
      success: false,
      error: 'no-description',
      message: 'Please provide a course description.',
    });
  }

  if (!plan || !(plan in config.plans)) {
    return res.status(400).json({
      success: false,
      error: 'no-plan',
      message: 'Please select a course plan.',
    });
  }

  // Handle the case where the user that is creating a course is an
  // administrator.
  if (req.user.is_admin) {
    return createCourse(req.user, name, description, plan)
      .then(course => res.status(200).json({
        success: true,
        isAdmin: true,
        courseId: course.uuid,
      }));
  }

  return res.status(400).json({
    success: false,
    error: 'not-implemented',
    message: 'Hold tight while we implement this feature.',
  });
});

/**
 * POST /api/course/enroll
 *
 * Handles enrolling a student with a UUID.
 */
router.post('/enroll', (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      error: 'no-code',
      message: 'Please provide a course code.',
    });
  }

  // Let's now try to enroll the student.
  return studentEnrollWithCode(req.user, code)
    .then((err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err.name,
        });
      }

      return res.status(200).json({
        success: true,
        code,
      });
    });
});

/**
 * GET /api/course/overview
 *
 * Gives an overview of the courses for both instructors and students.
 */
router.get('/overview', (req, res) => overviewHelper(req.user)
  .then(result => res.status(200).json(result)));

module.exports = router;
