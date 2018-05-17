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
      const dbPromise = Marker.find().where('userId').equals(testUser._id);
      const apiPromise = chai.request(app).get('/api/markers/dashboard').set('authorization', `Bearer ${token}`);
      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });

    it('should return unauthorized', () => {
      const dbPromise = Marker.find().where('userId').equals(testUser._id);
      const apiPromise = chai.request(app).get('/api/markers/dashboard').set('authorization', `Bearer ${token + 2}`);
      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => {
        }).catch((err) => {
          expect(err).to.have.status(401);
        });
    });
  });

  // Get markers based on filter
  describe('POST /api/markers/filter', () => {
    it('should get all the markers in the filter', () => {
      let filter = 'theft';
      const db = Marker.find({ incidentType: filter });
      const api = chai.request(app).post('/api/markers/filter').send({ 'filter': 'theft' });

      return Promise.all([db, api])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });
  });

  // Delete markers
  describe('DELETE /api/markers/delete', () => {
    it('should delete the marker', () => {
      const db = Marker.findByIdAndRemove('333333333333333333333300');
      const api = chai.request(app)
        .delete('/api/markers/delete')
        .set('authorization', `Bearer ${token}`)
        .send({ 'markerId': '333333333333333333333300' });

      return Promise.all([db, api])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.text).to.equal('{"message":"Marker Deleted"}');
        });
    });

    it('should return 400 for incorrect id', () => {
      const db = Marker.findByIdAndRemove('333333333333333333333555');
      const api = chai.request(app)
        .delete('/api/markers/delete')
        .set('authorization', `Bearer ${token}`)
        .send({ 'markerId': '333333333333333333333555' });

      return Promise.all([db, api])
        .then(([data, res]) => {
        }).catch((err) => {
          expect(err).to.have.status(400);
        });
    });
  });

  // Post a new marker
  describe('POST /api/new/marker', () => {
    it('add a new marker', () => {
      let newMarker = {
        'incidentType': 'theft',
        'date': '08/20/2017',
        'time': '02:01 PM',
        'location': { 'lat': 113.95300273973484, 'lng': -23.98032293782005 },
        'description': 'description',
        'userId': '333333333333333333333311'
      };
      const db = Marker.create(newMarker);
      const api = chai.request(app)
        .post('/api/new/marker')
        .set('authorization', `Bearer ${token}`)
        .send({
          'incidentType': 'theft',
          'date': '08/20/2017',
          'time': '02:01 PM',
          'location': { 'lat': 113.95300273973484, 'lng': -23.98032293782005 },
          'description': 'description',
          'userId': '333333333333333333333311'
        });

      return Promise.all([db, api])
        .then(([data, res]) => {
          console.log(res.body);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.contain({
            incidentType: 'theft',
            date: '08/20/2017',
            time: '02:01 PM',
            description: 'description',
            userId: '333333333333333333333300',
            icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
          });
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
