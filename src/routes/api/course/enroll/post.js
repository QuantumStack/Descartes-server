const express = require('express');

const Course = require('./../../../../models/Course');

const router = express.Router();


/**
 * studentEnrollWithCode takes in a User and a course's UUID and enrolls the
 * student into the course corresponding to that UUID if it exists.
 * @param user within the User table.
 * @param courseUUID of the course.
 * @returns Promise, undefined if the user was successfully enrolled. Otherwise
 *            it will return an error.
 */
const studentEnrollWithCode = (user, courseUUID) => user
  .$relatedQuery('profile')
  .then(profile => Course.query().findOne('uuid', courseUUID)
    .then((course) => {
      if (!course) {
        const err = new Error('Course ID is invalid');
        err.name = 'course-nonexistent';

        return err;
      }

      return course.$relatedQuery('students')
        .relate(profile.user_id)
        .then(() => null);
    }));


/**
 * POST /api/course/enroll
 *
 * Handles enrolling a student with a UUID.
 */
router.post('/', (req, res) => {
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

module.exports = router;
