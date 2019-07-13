/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const EmailVerificationToken = require('./../models/EmailVerificationToken');

/**
 * Initialize sets up things necessary when starting up the server.
 */
const initialize = () => {
  // We need to clear up all expired tokens...
  EmailVerificationToken.query()
    .where({})
    .then(tokens => {
      tokens.map(t => t.autoExpire());
    });
};

module.exports = initialize;
