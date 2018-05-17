const { app } = require('../index');
const chai = require('chai');
const chaiHTTP = require('chai-http');
const jwt = require('jsonwebtoken');
const { User } = require('../models/users');

const mongoose = require('mongoose');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');

describe('Safer API - Auth router', () => {
  before(function () {
    return mongoose.createConnection(TEST_DATABASE_URL);
  });

  beforeEach(function () {

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
