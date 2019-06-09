const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');


// Database Configuration
const Knex = require('knex');
const { Model } = require('objection');

const knexConfig = require('./db/knexfile');


// Import overall configuration
const config = require('./config');

if (config.app.node_env === 'production') {
  Model.knex(Knex(knexConfig.production));
} else {
  Model.knex(Knex(knexConfig.development));
}


const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Authentication Loading
 *
 * This part of configuration loads modules related to local authentication
 * using Passport.js and JWT.
 */
app.use(passport.initialize());
const signupStrategy = require('./util/auth/signup-strategy');
const loginStrategy = require('./util/auth/login-strategy');
const jwtStrategy = require('./util/auth/jwt-strategy');

passport.use('register', signupStrategy);
passport.use('login', loginStrategy);
passport.use('jwt', jwtStrategy);

// Initialize settings
require('./util/init')();

// Register routers
app.use('/', indexRouter);
app.use('/auth', authRouter);

// Catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, _req, res) => res.status(err.status || 500));

module.exports = app;
