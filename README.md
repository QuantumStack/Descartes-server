# Descartes Server

Express RESTful backend for Descartes.


<div align="right"><sup>
  made with ❤️ in Pittsburgh, PA by <a href="https://quantumstack.xyz">QuantumStack</a>
</sup></div>

## Testing

| Branch | Test Cases | Coverage |
|--------|--------|--------|
| `master` | [![Build Status](https://travis-ci.com/QuantumStack/Descartes-server.svg?branch=master)](https://travis-ci.com/QuantumStack/Descartes-server) | [![Coverage Status](https://coveralls.io/repos/github/QuantumStack/Descartes-server/badge.svg?branch=dev)](https://coveralls.io/github/QuantumStack/Descartes-server?branch=dev) |
| `dev` | [![Build Status](https://travis-ci.com/QuantumStack/Descartes-server.svg?branch=dev)](https://travis-ci.com/QuantumStack/Descartes-server) | [![Coverage Status](https://coveralls.io/repos/github/QuantumStack/Descartes-server/badge.svg?branch=master)](https://coveralls.io/github/QuantumStack/Descartes-server?branch=master) |

## Configuration

Go to `./app/config.js` and fill in the following.

```js

const config = {

  // Application Settings
  app: {
    node_env: 'dev',
    port: 3000,
  },

  // Authentication Settings, keep care of this.
  auth: {
    secret: 'secret_goes_here',
    salt_rounds: 12,
  },

  // Database Settings
  db: {
    development: {
      host: 'localhost',
      port: 5432,
      name: 'descartes',
      user: 'adityapillai',
      pass: null,
    },
    production: {
      host: 'localhost',
      port: 5432,
      name: 'descartes',
      user: 'adityapillai',
      pass: null,
    },
  },

  // Recaptcha Settings
  recaptcha: {
    secret: 'secretive',
    enabled: true,
  },

  // Emailing Settings
  email: {
    smtp_server: 'smtp.host.org',
    smtp_port: '587',
    smtp_user: 'user@email.com',
    smtp_password: 'secret passwords!!',
  },

  // Verification Token Settings
  email_verification_token: {
    expiry_time: 3600, // in seconds == 1 hour
    delay_time: 3600, // in seconds == 1 hour
  },

};


module.exports = config;

```