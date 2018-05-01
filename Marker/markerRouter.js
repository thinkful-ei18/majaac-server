'use strict';

const express = require('express');
const router = express.Router();
const Marker = require('./markerModel');

// A protected endpoint which needs a valid JWT to access it
router.post('/marker', (req, res) => {
  const { type, location, description, userId } = req.body
    .create({ type, location, description, userId })
    .then(results => {
      return res.status(200).json(results);
    });

});


router.get('/marker', (req, res) => {
  Marker
    .find()
    .then(results => {
      return res.status(200).json(results);
    });

});

module.exports = router;