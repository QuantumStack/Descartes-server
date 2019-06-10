
const Course = require('./../../models/Course');

module.exports = (user, courseUUID) => user
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
