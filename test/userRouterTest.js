'use strict';

const { app } = require('../index');
const chai = require('chai');
const chaiHTTP = require('chai-http');
const expect = chai.expect;
const jwt = require('jsonwebtoken');
const { User } = require('../models/users');

const mongoose = require('mongoose');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');

describe('Safer API - User router', () => {
  before(function () {
    return mongoose.createConnection(TEST_DATABASE_URL);
  });

  beforeEach(function () {

  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase()
      .catch(err => console.error(err));
  });

  after(function () {
    return mongoose.disconnect();
  });

  // Login
  describe.only('POST /api/users/', () => {
    it('create a new user', () => {
      let passwordHash = User.hashPassword('testpassword1');
      const db = User.find();
      const api = chai.request(app)
        .post('/api/users/')
        .send({
          'username': 'testusername1',
          'password': 'testpassword1'
        });

      return Promise.all([db, api])
        .then(([data, res]) => {
          expect(res.body).to.include({
            username: 'testusername1',
            firstName: '',
            lastName: '',
            profilePicture: ''
          });
        });
    });
  });
});