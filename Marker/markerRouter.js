'use strict';

const express = require('express');
const router = express.Router();
const Marker = require('./markerModel');
const passport = require('passport');

const jwtAuth = passport.authenticate('jwt', { session: false });

router.post('/new/marker', jwtAuth, (req, res) => {
  console.log('im here', req.user.id);
  const userId = req.user.id;
  const { incidentType, location, description } = req.body;
  const newMarker = { incidentType, location, description, userId };
  console.log(newMarker);
  Marker.create({ incidentType, location, description, userId })
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

router.get('/markers/dashboard', jwtAuth, (req, res) => {
  const userId = req.user.id;
  console.log(req.user.id);
  Marker.find({ userId: req.user.id })
    .then(res => {
      return res.status(200).json(res);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

module.exports = router;
