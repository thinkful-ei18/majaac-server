'use strict';

const mongoose = require('mongoose');


const markerSchema = mongoose.Schema({
  date: { type: Date, default: Date.now },
  location: { type: [Number] }, // [long, lat]
  type: { type: String, default: '' },
  // TODO: change default marker
  icon: { type: String, default: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png' },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Marker', markerSchema);