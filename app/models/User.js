const { Model } = require('objection');

class User extends Model {
  // Define the table name
  static get tableName() {
    return 'users';
  }

  // Get email
  getEmail() {
    return this.email;
  }

  // Get hashed password
  getPassword() {
    return this.password;
  }

  // Soft delete the user
  softDelete() {
    this.is_deleted = true;
  }
}

module.exports = User;
