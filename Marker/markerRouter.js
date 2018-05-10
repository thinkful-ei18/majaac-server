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
  const userId = getUserId(req);
  const { incidentType, date, time, description, location } = req.body;

  if (typeof location !== 'object') {
    const err = new Error('Location should be object with latitude and longitude');
    err.status = 422;
    return next(err);
  }

  let icon;

  switch (incidentType) {
  case 'Other': {
    icon = 'http://res.cloudinary.com/dw6hemcpj/image/upload/v1525883157/map_icon_other.png'; // caution icon
    break;
  }
  case 'Accident': {
    icon = 'http://res.cloudinary.com/dw6hemcpj/image/upload/v1525883156/map_icon_accident.png'; // car icon
    break;
  }
  case 'Crime': {
    icon = 'http://res.cloudinary.com/dw6hemcpj/image/upload/v1525883156/map_icon_crime.png'; // crime icon
    break;
  }
  case 'Road-Construction': {
    icon = 'http://res.cloudinary.com/dw6hemcpj/image/upload/v1525883156/map_icon_traffic_construction.png'; // construction
    break;
  }
  case 'Theft': {
    icon = 'http://res.cloudinary.com/dw6hemcpj/image/upload/v1525883157/map_icon_theft.png'; // theft icon
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
  Marker.find()
		.then(results => {
  return res.status(200).json(results);
})
		.catch(err => {
  res.status(404).json(err);
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

router.post('/markers/filter', (req, res) => {
  let { filter } = req.body;
  if (!filter) {
    filter = {};
  } else {
    filter = { incidentType: filter };
  }

  Marker.find(filter)
		.then(result => {
  return res.json(result);
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
