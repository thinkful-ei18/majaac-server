'use strict';
const { Strategy: LocalStrategy } = require('passport-local');

const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models/users');
const { JWT_SECRET } = require('../config');

const localStrategy = new LocalStrategy((username, password, callback) => {
  let user;
  User.findOne({ username })
    .then(resUser => {
      user = resUser;
      if (!user) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username',
          location: 'username',
          status: 422
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect password',
          location: 'password',
          status: 422
        });
      }
      //if the if statement does not run return the user
      return callback(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(err);
      }
      return callback(null, false);
    });
});

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    algorithms: ['HS256'],
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy };
