'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
const markerRouter = require('./Marker/markerRouter');

const app = express();

const {
  router: authRouter,
  localStrategy,
  jwtStrategy,
} = require('./auth/index');
const { router: usersRouter } = require('./routes/users.js');

app.use(bodyParser.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

// ORDER VERY IMPORTANT, DO NOT MOVE
app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

app.use('/api', markerRouter);

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test',
  })
);


/* ========== ERROR HANDLING ========== */
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});


function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
