'use strict';
var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var session = require('express-session');
var pg = require('pg');
var pgSession = require('connect-pg-simple')(session);
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var authenticate = require('./utils/utils').authenticate;
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

var SESSION_MAX_AGE = 86400000;


// Passport session setup.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Google OAuth2
passport.use(new GoogleStrategy({
        callbackURL: '/auth/google/return',
        passReqToCallback   : true,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    },
    function(request, accessToken, refreshToken, profile, done) {
        console.log('---------------------session authenticate');
        // Authenticate the user against the database and get permissions
        authenticate(request, profile);

        return done(null, profile);
    }
));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('trust proxy', 1);

// Set up middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use('/media', express.static(path.join(__dirname, 'media')));

// Session middleware
app.use(session({
    store: new pgSession({
        pg: pg,
        conString: process.env.DATABASE_URL
    }),
    secret: process.env.APP_SECRET,
    saveUninitialized: true,
    cookie: {maxAge: SESSION_MAX_AGE},
    resave: true
}));

app.use( passport.initialize());
app.use( passport.session());

var routes = require('./routes/index');
var rota = require('./routes/rota');
var people = require('./routes/people');
var events = require('./routes/events');
var eventdates = require('./routes/eventdates');

app.use('/', routes);
app.use('/rota', rota);
app.use('/api', expressJwt({secret: process.env.APP_SECRET}));
app.use('/api', people);
app.use('/api', events);
app.use('/api', eventdates);

app.get('/login', function(req, res){
    res.render('login', { user: req.user });
});

// Redirect the user to Google for authentication.  When complete, Google
// will redirect the user back to the application at /auth/google/return
app.get('/auth/google',
    passport.authenticate('google', {
            scope: ['email'] //['https://www.googleapis.com/auth/userinfo.email']
        }
    ));

// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
app.get( '/auth/google/return',
    passport.authenticate( 'google', {
        successRedirect: '/rota',
        failureRedirect: '/login'
    }));


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