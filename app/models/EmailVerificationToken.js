const { Model } = require('objection');
const User = require('./User');

const logger = require('./../util/logger');

const expiryTime = require('./../config').email_verification_token.expiry_time;

class EmailVerificationToken extends Model {
  // Define the table name
  static get tableName() {
    return 'email_verification_tokens';
  }

  // Define relations
  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'email_verification_tokens.user_id',
          to: 'users.id',
        },
      },
    };
  }

  // Set expiry
  autoExpire() {
    // We need Date.now() because when we create the token and run
    // $afterInsert, created_at may be null.
    const createdAt = this.created_at || Date.now();

    // Calculate timeTillDelete with the fact that we're dealing with time
    // in milliseconds, but expiryTime is given to us in seconds.
    const timeTillDelete = createdAt - Date.now() + (expiryTime * 1000);

    logger.log({
      level: 'debug',
      message: `Deleting emailVerificationToken with ID ${this.id} in `
        + `${timeTillDelete / 1000} seconds.`,
    });

    setTimeout(() => {
      EmailVerificationToken.query().deleteById(this.id)
        .then(() => {
          logger.log({
            level: 'debug',
            message: `Deleted emailVerificationToken with ID ${this.id}.`,
          });
        });
    },
    timeTillDelete);
  }

  // Automatically handle expiration after inserting...
  $afterInsert(queryContext) {
    super.$afterInsert(queryContext);
    this.autoExpire();
  }
}

module.exports = EmailVerificationToken;
