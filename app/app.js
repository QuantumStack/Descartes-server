const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors');

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
const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

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
app.use('/api',
  passport.authenticate('jwt', { session: false }),
  apiRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404, '404 Not Found')));

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => res.sendStatus(err.status || 500));

module.exports = app;
