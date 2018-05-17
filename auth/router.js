'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const createAuthToken = function (user) {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256',
  });
};

const localAuth = passport.authenticate('local', { session: false });

//need a parser for this to work.
router.use(bodyParser.json());

//when user tries to login this is the route
//they will provide username and password
router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.json({ authToken });
});

const jwtAuth = passport.authenticate('jwt', { session: false });

//will refresh auth token with a new one in exchange for old one.
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = { router };
