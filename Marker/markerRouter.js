'use strict';

const express = require('express');
const router = express.Router();
const Marker = require('./markerModel');
const passport = require('passport');

const jwtAuth = passport.authenticate(
  'jwt',
  { session: false },
  (error, user, info) => {
    console.log('error = ', error, ' info = ', info, '  user = ', user);
  }
);

router.post('/new/marker', jwtAuth, (req, res) => {
  console.log('im here', req.headers);
  const userId = req.user.id;
  const { incidentType, location, description } = req.body;
  const newMarker = { incidentType, location, description };
  console.log(newMarker);
  Marker.create({ incidentType, location, description })
    .then(results => {
      return res.status(200).json(results);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

router.get('/markers', (req, res) => {
  Marker.find().then(results => {
    return res.status(200).json(results);
  });
});

module.exports = router;
