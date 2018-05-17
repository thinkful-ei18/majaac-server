'use strict';

const { app } = require('../index');
const chai = require('chai');
const chaiHTTP = require('chai-http');
const expect = chai.expect;
const jwt = require('jsonwebtoken');
const { User } = require('../models/users');

const mongoose = require('mongoose');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');
const Marker = require('../Marker/markerModel');
const seedMarkers = require('./seedMarkers');

let token;
describe('Safer API - Markers', () => {
  const testUser = {
    'username': 'bumper2',
    'password': 'catsarecool',
    '_id': '333333333333333333333300'
  };

  before(function () {
    return mongoose.createConnection(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    const userPasswordPromise = User.hashPassword(testUser.password);
    const userCreatePromise = User.create(testUser);
    const markerInsertPromise = Marker.insertMany(seedMarkers);
    testUser.id = testUser._id;
    token = jwt.sign(
      {
        user: testUser
      },
      JWT_SECRET,
      {
        algorithm: 'HS256',
        subject: testUser.username,
        expiresIn: '7d'
      }
    );

    return Promise.all([userPasswordPromise, userCreatePromise, markerInsertPromise])
      .then(() => {
        console.log('worked');
      });
  });

  afterEach(function () {
    User.remove({});
    return mongoose.connection.db.dropDatabase()
      .catch(err => console.error(err));
  });

  after(function () {
    return mongoose.disconnect();
  });

  // Get all markers - unauthorized (DESKTOP)
  describe('GET /api/markers', () => {
    it('should get all the markers', () => {
      const db = Marker.find();
      const api = chai.request(app).get('/api/markers');

      return Promise.all([db, api])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });
  });

  // Get all markers - authorized (MOBILE)
  describe('GET /api/markers/dashboard', () => {
    it('should get all the markers for the mobile dashboard', () => {
      let authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWFmZGE2MGI3OTE5MjEzNTUyMmVkOGEwIiwidXNlcm5hbWUiOiJmcm9udGVuZDIyMiIsImZpcnN0TmFtZSI6IiIsImxhc3ROYW1lIjoiIiwicHJvZmlsZVBpY3R1cmUiOiIifSwiaWF0IjoxNTI2NTcyNTk5LCJleHAiOjE1MjcxNzczOTksInN1YiI6ImZyb250ZW5kMjIyIn0.nwqemCgcqB3f8Eo8yhgBEBhsEtOcHrPrKYwtydEp4ZU"
      const db = Marker.find();
      const api = chai.request(app).get('/api/markers');

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
