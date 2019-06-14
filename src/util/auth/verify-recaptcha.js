const request = require('request');

const { recaptcha } = require('./../../config');

module.exports = (code, callback) => {
  if (recaptcha.enabled) {
    request.post('https://www.google.com/recaptcha/api/siteverify', {
      form: {
        secret: recaptcha.secret,
        response: code,
      },
      json: true,
    }, (err, res, body) => {
      if (err) return callback(false);
      return callback(body.success);
    });
  } else {
    callback(true);
  }
};
