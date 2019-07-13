/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const crypto = require('crypto-random-string');

const EmailVerificationToken = require('./../../models/EmailVerificationToken');

module.exports = user => {
  const t = crypto({ length: 64, type: 'url-safe' });

  return EmailVerificationToken.query()
    .insert({
      token: t,
      user_id: user.id,
    })
    .then(verificationToken => verificationToken.token);
};
