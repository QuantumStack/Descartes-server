/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

require('dotenv').config();

const config = {
  // Application Settings
  app: {
    node_env: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3000,
    client_url: process.env.CLIENT_URL || 'http://localhost:3000',
  },

  // Authentication Settings, keep care of this.
  auth: {
    secret: process.env.SECRET || 'secret_goes_here',
    salt_rounds: 12,
  },

  // Database Settings
  db: {
    development: {
      host: 'localhost',
      port: 5432,
      name: 'descartes',
      user: 'postgres',
      pass: null,
    },
    production: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      name: process.env.DB_NAME || 'descartes',
      user: process.env.DB_USER || 'adityapillai',
      pass: process.env.DB_PASS || null,
    },
  },

  // Recaptcha Settings
  recaptcha: {
    secret:
      process.env.RECAPTCHA_SECRET ||
      '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
    enabled: process.env.RECAPTCHA_ENABLED || true,
  },

  // Emailing Settings
  email: {
    smtp_server: process.env.SMTP_SERVER || 'smtp.mailgun.org',
    smtp_port: process.env.SMTP_PORT || '587',
    smtp_user: process.env.SMTP_USER || 'bad@mail.example.com',
    smtp_password: process.env.SMTP_PASSWORD || 'badpassword',
  },

  // Verification Token Settings
  email_verification_token: {
    expiry_time: 4, // in seconds == 1 hour
    delay_time: 1, // in seconds == 1 hour
  },

  // Stripe settings
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY || '',
    public_key: process.env.STRIPE_PUBLIC_KEY || '',
  },

  // Plans settings
  plans: {
    0: {
      name: 'standard',
      price: 60,
      expDays: 185,
    },
    1: {
      name: 'lite',
      price: 15,
      expDays: 185,
    },
  },
};

module.exports = config;
