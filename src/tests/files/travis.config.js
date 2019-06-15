
const config = {

  // Application Settings
  app: {
    node_env: 'dev',
    port: 3000,
    client_url: 'http://localhost:3000',
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
      user: 'postgres',
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
    enabled: false,
  },

  // Emailing Settings
  email: {
    smtp_server: 'smtp.mailgun.org',
    smtp_port: '587',
    smtp_user: 'bad@mail.example.com',
    smtp_password: 'badpassword',
  },

  // Verification Token Settings
  email_verification_token: {
    expiry_time: 5, // in seconds == 1 hour
    delay_time: 5, // in seconds == 1 hour
  },

  // Stripe settings
  stripe: {
    secret_key: '',
    public_key: '',
  },

  // Plans settings
  plans: {
    std: {
      price: 60,
      expDays: 185,
    },
    lit: {
      price: 15,
      expDays: 185,
    },
  },

};


module.exports = config;
