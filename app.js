'use strict';
var express = require('express');
var app = express();
var cors = require('cors');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var pg = require('pg');

// Handle token-based authentication
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

// Allow pre-flight across the board because of the Authorization header
app.options('*', cors());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('trust proxy', 1);

// Set up middleware
app.use(logger('dev'));

var people = require('./routes/people');
var events = require('./routes/events');
var eventdates = require('./routes/eventdates');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware for CORS and token-based authentication
app.use('/api', cors());
app.use('/api', expressJwt({secret: process.env.APP_SECRET}));

// API methods
app.use('/api', people);
app.use('/api', events);
app.use('/api', eventdates);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;