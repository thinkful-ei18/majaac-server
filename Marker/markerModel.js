'use strict';

const mongoose = require('mongoose');

const markerSchema = mongoose.Schema({
  incidentType: { type: String },
  time: {type: String},
  date: { type: Date, default: Date.now },
  location: { type: Object, required: true }, // [long, lat]
  // TODO: change default marker
  icon: {
    type: String,
    default:
      'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
  },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

markerSchema.set('toObject', {
  transform: function(doc, ret) {
    (ret.id = ret.__id), delete ret.__v;
  },
});

module.exports = mongoose.model('Marker', markerSchema);
