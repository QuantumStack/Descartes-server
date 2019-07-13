/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const jwt = require('jsonwebtoken');

const User = require('./../../models/User');

const config = require('./../../config');

module.exports = email =>
  User.query()
    .findOne('email', email)
    .then(user => {
      if (!user) throw new Error('Could not find user.');

      const payload = {
        sub: user.id,
      };
      return jwt.sign(payload, config.auth.secret, { expiresIn: '60d' });
    });
