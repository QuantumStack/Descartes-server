/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const nodemailer = require('nodemailer');

const logger = require('./logger');
const { email } = require('./../config');

// create nodemailer transport using settings from .env
const transporter = nodemailer.createTransport({
  host: email.smtp_server,
  port: email.smtp_port,
  secure: false, // TODO: upgrade later with STARTTLS
  auth: {
    user: email.smtp_user,
    pass: email.smtp_password,
  },
});

// make sure the mail transport works
transporter.verify(error => {
  if (error) {
    logger.log({
      level: 'error',
      message: 'Email service not working...',
    });
  } else {
    logger.log({
      level: 'info',
      message: 'Email service ready...',
    });
  }
});

module.exports = transporter;
