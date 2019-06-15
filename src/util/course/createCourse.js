const config = require('./../../config');

const InstructorCourse = require('./../../models/InstructorCourse');

module.exports = (user, name, description, planId) => {
  // Calculate the expiration time.
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + config.plans.planId.expDays);

  return user.$relatedQuery('profile')
    // Get the user's profile
    .then(profile => profile
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
      .then(course => profile.$relatedQuery('instructorCourses')
        .relate(course.id)
        // After we relate them, we need to make them an instructor that has
        // admin access.
        .then(() => InstructorCourse.query().findOne({
          instructor_id: profile.user_id,
          course_id: course.id,
        })
          .update({ is_course_admin: true })
          // And of course, let's return the course.
          .then(() => course))));
};
