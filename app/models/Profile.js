const { Model } = require('objection');
const User = require('./User');

class Profile extends Model {
  // Define the table name
  static get tableName() {
    return 'profiles';
  }

  // Define relations
  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'profiles.user_id',
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = Profile;
