'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  markers: {
    type: Object,
  },
});

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};
userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 6);
};

userSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
  };
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
