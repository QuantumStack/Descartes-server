const { Model } = require('objection');
/* eslint-disable global-require */

class User extends Model {
  // Define the table name
  static get tableName() {
    return 'users';
  }

  // Define relations
  static get relationMappings() {
    const EmailVerificationToken = require('./EmailVerificationToken');
    const Profile = require('./Profile');

    return {
      profile: {
        relation: Model.HasOneRelation,
        modelClass: Profile,
        join: {
          from: 'users.id',
          to: 'profiles.user_id',
        },
      },
      emailVerificationTokens: {
        relation: Model.HasManyRelation,
        modelClass: EmailVerificationToken,
        join: {
          from: 'users.id',
          to: 'email_verification_tokens.user_id',
        },
      },
    };
  }

  // Get hashed password
  getPassword() {
    return this.password;
  }
}

module.exports = User;
