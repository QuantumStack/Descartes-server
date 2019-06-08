# Descartes Server

Express RESTful backend for Descartes.


<div align="right"><sup>
  made with ❤️ in Pittsburgh, PA by <a href="https://quantumstack.xyz">QuantumStack</a>
</sup></div>

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

};

module.exports = config;
```