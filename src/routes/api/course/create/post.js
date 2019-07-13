/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const express = require('express');

const config = require('./../../../../config');

const InstructorCourse = require('./../../../../models/InstructorCourse');
const CoursePlan = require('./../../../../models/CoursePlan');

const stripe = require('stripe')(config.stripe.secret_key);

const router = express.Router();

/** createCourse
 *
 *  Creates a course using a user account and course information.
 */
const createCourse = (user, name, description, coursePlan) => {
  // Calculate the expiration time.
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + coursePlan.length_in_days);

  return (
    user
      .$relatedQuery('profile')
      // Get the user's profile
      .then(profile =>
        profile
          // With that profile, we will add a course for which they are the owner
          .$relatedQuery('ownerCourses')
          .insert({
            name,
            description,
            plan_uuid: coursePlan.uuid,
            expires_at: expiryDate,
          })
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

// Export this function for other parts of the program to use.
exports.createCourse = createCourse;

/** POST /api/course/create
 *
 * Creating a course, redirect to stripe.
 */
router.post('/', (req, res) => {
  const { name, description, plan, price, coupon } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'no-course-name',
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

  if (plan === null) {
    return res.status(400).json({
      success: false,
      error: 'no-plan',
      message: 'Please select a course plan.',
    });
  }

  return CoursePlan.query()
    .where('uuid', plan)
    .first()
    .then(coursePlan => {
      if (!coursePlan) {
        return res.status(400).json({
          success: false,
          error: 'invalid-plan',
          message: 'Please select a valid course plan.',
        });
      }
      // Handle the case where the user that is creating a course is an
      // administrator.
      if (req.user.is_admin) {
        return createCourse(req.user, name, description, coursePlan).then(
          course =>
            res.status(200).json({
              success: true,
              isFree: true,
              courseId: course.uuid,
            })
        );
      }

      // Coupon logic

      // Handle coupon logic
      return res.status(400).json({
        success: false,
        error: 'not-implemented',
        message: 'Hold tight while we implement this feature.',
      });
    });
});

module.exports = router;
