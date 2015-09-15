'use strict';
var pg = require('pg');
var async = require('async');
var sql = require('../utils/query');
var jwt = require('jsonwebtoken');
var SESSION_MAX_AGE_mins = 1440;


var utils = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    },

    authenticate: function(request, profile) {
        async.waterfall([
            // First, authenticate the user using the email address
            function(callback) {
                pg.connect(sql.databaseUrl(), function(err, client, done) {
                    var query = client.query("SELECT * FROM person WHERE active and email = $1", [profile.email]);

                    var records = [];
                    query.on('row', function(row) {
                        records.push(row);
                    });

                    // After all data is returned, close connection and return results
                    query.on('end', function() {
                        var user = null;
                        var error = null;
                        if (records.length > 0) {
                            user = {
                                userId: records[0].id,
                                email: profile.email,
                                name: profile.displayName,
                                role: records[0].user_role
                            };
                            request.session.user = user;
                        } else {
                            // TODO: redirect to the error page
                            request.session = null;
                            error = 'User not found';
                        }
                        request.session.save(function() {
                            client.end();
                            callback(error, request, user);
                        });
                    });
                });
            },

            // Second, get the events the user can administrate
            function(request, user, callback) {
                if (!user) {
                    callback('User not found', null);
                }

                pg.connect(sql.databaseUrl(), function(err, client, done) {
                    var query = client.query(sql.permissions(), [user.userId]);

                    var records = [];
                    query.on('row', function(row) {
                        records.push(row);
                    });

                    // After all data is returned, close connection and return results
                    query.on('end', function() {
                        // Store the events that the user can administrate
                        user.eventAdministrate = records;
                        request.session.user = user;

                        // Add the JWT token to the session
                        request.session.token = jwt.sign(
                            user, process.env.APP_SECRET, { expiresInMinutes: SESSION_MAX_AGE_mins });

                        request.session.save(function() {
                            client.end();
                            callback(null, request, user);
                        });
                    });
                });
            },

            // Third, update the last login of the user
            function(request, user, callback) {
                if (!user) {
                    callback('User not found', null);
                }

                pg.connect(sql.databaseUrl(), function(err, client, done) {
                    var query = client.query(sql.updateLastLogin(), [user.userId]);

                    // After all data is returned, close connection and return results
                    query.on('end', function() {
                            client.end();
                            callback(null, request, user);

                    });
                });

            }

        ], function(err, request, user) {
            console.log(user);
            if (err) {
                console.log(err);
            }
            if (!user) {
                // TODO: redirect to the error page
                console.log('User not found');
            }
        });
    }
 };


module.exports = utils;