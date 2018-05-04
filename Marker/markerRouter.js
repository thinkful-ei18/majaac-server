'use strict';

const express = require('express');
const router = express.Router();
const Marker = require('./markerModel');
const passport = require('passport');
const { getUserId } = require('../utils/getUserId');

const jwtAuth = passport.authenticate('jwt', { session: false });

router.post('/new/marker', jwtAuth, (req, res) => {
  const userId = getUserId(req);
  const { incidentType, date, time, description, location } = req.body;
  const newMarker = { incidentType, date, time, description, location, userId };

  Marker.create(newMarker)
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
  const userId = getUserId(req);
  Marker.find()
    .where('userId')
    .equals(userId)
    .then(result => {
      console.log(result);
      return res.status(200).json(result);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

router.delete('/markers/delete', jwtAuth, (req, res) => {
  const markerId = req.body.markerId;
  Marker.findByIdAndRemove(markerId)
    .then(() => res.json({ message: 'Marker Deleted' }))
    .catch(err => res.status(400).json(err));
});

module.exports = router;
