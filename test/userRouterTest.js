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

    it('throw an error without a password', () => {
      const db = User.find();
      const api = chai.request(app)
        .post('/api/users/')
        .send({
          'username': 'testusername1',
        });

      return Promise.all([db, api])
        .then(([data, res]) => {
        }).catch(err => {
          expect(err).to.have.status(422);
          expect(err.response.body.message).to.equal('You are missing a field');
          expect(err.response.body.location).to.equal('password');
        });
    });

    it('throw an error without a username', () => {
      const db = User.find();
      const api = chai.request(app)
        .post('/api/users/')
        .send({
          'password': 'testusername1',
        });

      return Promise.all([db, api])
        .then(([data, res]) => {
        }).catch(err => {
          expect(err).to.have.status(422);
          expect(err.response.body.message).to.equal('You are missing a field');
          expect(err.response.body.location).to.equal('username');
        });
    });

    it('throw an error if username is already taken', () => {
      const db = User.find();
      const api = chai.request(app)
        .post('/api/users/')
        .send({
          'username': 'bumper2',
          'password': 'testpassword'
        });

      return Promise.all([db, api])
        .then(([data, res]) => {
        }).catch(err => {
          expect(err).to.have.status(422);
          expect(err.response.body.message).to.equal('Username taken');
          expect(err.response.body.location).to.equal('username');
        });
    });

    it('throw an error if username is not a string', () => {
      const db = User.find();
      const api = chai.request(app)
        .post('/api/users/')
        .send({
          'username': 123,
          'password': 'testpassword'
        });

      return Promise.all([db, api])
        .then(([data, res]) => {
        }).catch(err => {
          expect(err).to.have.status(422);
          expect(err.response.body.message).to.equal('Incorrect Type of Field');
          expect(err.response.body.location).to.equal('username');
        });
    });

    it('throw an error if password has whitespace', () => {
      const db = User.find();
      const api = chai.request(app)
        .post('/api/users/')
        .send({
          'username': 'bumper2',
          'password': ' testpassword '
        });

      return Promise.all([db, api])
        .then(([data, res]) => {
        }).catch(err => {
          expect(err).to.have.status(422);
          expect(err.response.body.message).to.equal('Cannot start or end with whitespace');
          expect(err.response.body.location).to.equal('password');
        });
    });
  });
});