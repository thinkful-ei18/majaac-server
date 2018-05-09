'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const { User } = require('../models/users');
const { getUserId } = require('../utils/getUserId');
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });

const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password'];
  //will return a value if field at time of submission is missing.
  const missingField = requiredFields.find(field => !(field in req.body));

  //if missingField exists its because something is missing will send 422 status back
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidiationError',
      message: 'You are missing a field',
      location: missingField,
    });
  }

  const stringFields = ['username', 'password'];
  //nonStringField checks to make sure the username and password
  //passed in are of type string
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  //if nonStringField exists it means something was passed not as a string
  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidiationError',
      message: 'Incorrect Type of Field',
      location: nonStringField,
    });
  }

  //if the field has whitespace we want to check that.
  const explicitTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicitTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  //if nonTrimmedField exists its because there is whitespace in username or password.
  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField,
    });
  }

  //retrieving the fields and destructuring into the variables below.
  let { username, password, firstName, lastName } = req.body;
  User.find({ username })
    .count() //count instances of this username
    .then(count => {
      //if count is greater than 0 than this user name exists. reject.
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username taken',
          location: 'username',
        });
      }
    })
    //if count is not greater than 0 hashpassword and create user.
    .then(() => {
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        lastName,
        firstName,
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

// FIXME: BROKEN
router.put('/profilePicture', jwtAuth, (req, res) => {
  const ppUpload = req.params;
  const userId = getUserId(req);
  User
    .findById(userId)
    .update({ profilePicture: ppUpload })
    .then(result => {
      return res.status(200).json(result);
    })
    .catch(err => {
      res.status(404).json(err);
    });

});

module.exports = { router };
