'use strict';
const app = require('../index');
const mongoose = require('mongoose');
const assert = require('chai').assert;
const Marker = require('../Marker/markerRouter');
const { TEST_DATABASE_URL } = require('../config');

describe('Create Markers', function() {
  afterEach(function() {
    return mongoose.connection.db.dropDatabase().catch(err => console.error(err));
  });
  after(function() {
    return mongoose.disconnect();
  });
  it('Creates a marker to database', function(done) {
    const mark = new Marker({
      incidentType: 'crime',
      date: '10/20/2017',
      time: '11:01 AM',
      location: {
        lng: -23.98032293782005,
        lat: 123.95300273973484,
      },
      userId: '5afb1e3200a094001472073a',
      description: 'Mocha and Chai Test',
    });
    Marker.create(mark).then(() => {
      assert(mark.isNew === false);
    });
  });
});
