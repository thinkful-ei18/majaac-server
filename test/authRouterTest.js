'use strict';

const { app } = require('../index');
const chai = require('chai');
const chaiHTTP = require('chai-http');
const expect = chai.expect;
const jwt = require('jsonwebtoken');
const { User } = require('../models/users');

const mongoose = require('mongoose');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');

describe.only('Safer API - Auth router', () => {
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
    testUser.id = testUser._id;

    return Promise.all([userPasswordPromise, userCreatePromise,])
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

  // Login
  describe('POST /api/auth/login', () => {
    it('login the user', () => {
      const obj = JSON.stringify({ 'username': testUser.username, 'password': testUser.password });
      // const db = User.find();
      const api = chai.request(app)
        .post('/api/auth/login')
        .set({ 'Content-Type': 'application/json' })
        .send(obj);

      console.log(obj);
      return Promise.all([api])
        .then(([res]) => {
          console.log(res);
        });
    });
  });
});