'use strict';

const express = require('express');
const router = express.Router();
const Marker = require('./markerModel');

router.post('/new/marker', (req, res) => {
  const { incidentType, location, description, userId } = req.body;
  const newMarker = { incidentType, location, description, userId };
  console.log(newMarker);
  Marker
    .create({ incidentType, location, description, userId })
    .then(results => {
      return res.status(200).json(results);
    });

});



router.get('/markers', (req, res) => {
  Marker
    .find()
    .then(results => {
      return res.status(200).json(results);
    });

});

module.exports = router;