'use strict';

const app = require('../index');
const chai = require('chai');
const chaiHTTP = require('chai-http');
const expect = chai.expect;

const mongoose = require('mongoose');
const { TEST_DATABASE_URL } = require('../config');
const Marker = require('../Marker/markerRouter');
const seedMarkers = require('./seedMarkers');

describe('Safer API - Markers', () => {
  before(function () {
    return mongoose.createConnection(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return Marker.insertMany(seedMarkers);
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/markers/dashboard', () => {
    it('should get all the folders', () => {
      const db = Marker.find();
      const api = chai.request(app).get('/api/markers/dashboard');

      return Promise.all([db, api])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });
  });
});









// describe('Create Markers', function() {
//   afterEach(function() {
//     return mongoose.connection.db.dropDatabase().catch(err => console.error(err));
//   });
//   after(function() {
//     return mongoose.disconnect();
//   });
//   it('Creates a marker to database', function(done) {
//     const mark = new Marker({
//       incidentType: 'crime',
//       date: '10/20/2017',
//       time: '11:01 AM',
//       location: {
//         lng: -23.98032293782005,
//         lat: 123.95300273973484,
//       },
//       userId: '5afb1e3200a094001472073a',
//       description: 'Mocha and Chai Test',
//     });
//     Marker.create(mark).then(() => {
//       assert(mark.isNew === false);
//     });
//   });
// });
