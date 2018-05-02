'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
const markerRouter = require('./Marker/markerRouter');

const app = express();

const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
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
