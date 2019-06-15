const express = require('express');

const config = require('./../../../../config');

const InstructorCourse = require('./../../../../models/InstructorCourse');

const router = express.Router();

/** createCourse
 *
 *  Creates a course using a user account and course information.
 */
const createCourse = (user, name, description, planId) => {
  // Calculate the expiration time.
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + config.plans.planId.expDays);

  return (
    user
      .$relatedQuery('profile')
      // Get the user's profile
      .then(profile =>
        profile
          // With that profile, we will add a course for which they are the onwer
          .$relatedQuery('ownerCourses')
          .insert({
            name,
            description,
            plan_id: planId,
            expires_at: expiryDate,
          })
          // After that course is created, we need to add them to the list of
          // instructors for that course with admin access.
          .then(course =>
            profile
              .$relatedQuery('instructorCourses')
              .relate(course.id)
              // After we relate them, we need to make them an instructor that has
              // admin access.
              .then(() =>
                InstructorCourse.query()
                  .findOne({
                    instructor_id: profile.user_id,
                    course_id: course.id,
                  })
                  .update({ is_course_admin: true })
                  // And of course, let's return the course.
                  .then(() => course)
              )
          )
      )
  );
};

/** POST /api/course/create
 *
 * Creating a course, redirect to stripe.
 */
router.post('/', (req, res) => {
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
    return createCourse(req.user, name, description, plan).then(course =>
      res.status(200).json({
        success: true,
        isAdmin: true,
        courseId: course.uuid,
      })
    );
  }

  return res.status(400).json({
    success: false,
    error: 'not-implemented',
    message: 'Hold tight while we implement this feature.',
  });
});

module.exports = router;
