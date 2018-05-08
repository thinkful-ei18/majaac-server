'use strict';

const express = require('express');
const router = express.Router();
const Marker = require('./markerModel');
const passport = require('passport');
const { getUserId } = require('../utils/getUserId');

const jwtAuth = passport.authenticate('jwt', { session: false });

router.post('/new/marker', jwtAuth, (req, res, next) => {
  const requiredFields = ['incidentType', 'date', 'time', 'description', 'location'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in incident report`);
    err.status = 422;
    return next(err);
  }

  let icon;
  const userId = getUserId(req);
  const { incidentType, date, time, description, location } = req.body;
  switch (incidentType) {
  case 'other': {
    icon = 'https://i.imgur.com/NpcXSor.png'; // caution icon
    break;
  }
  case 'accident': {
    icon = 'https://i.imgur.com/RmolD1w.png'; // car icon
    break;
  }
  case 'crime': {
    icon = 'https://i.imgur.com/0AQQaMn.png'; // crime icon
    break;
  }
  case 'roadconstruction': {
    icon = 'https://i.imgur.com/enG4g3B.png'; // construction
    break;
  }
  case 'theft': {
    icon = 'https://i.imgur.com/CaZTP4c.png'; // theft icon
    break;
  }
  }
  const newMarker = { incidentType, date, time, description, location, userId, icon };
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
