var express = require('express');
var router = express.Router();
var pg = require('pg');
var async = require('async');
var moment = require('moment');
var apiAuthenticated = require('../utils/utils').apiAuthenticated;
var sql = require('../utils/query');


var eventDateSummary = function(dateId) {
    // Get a Postgres client from the connection pool
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        var query = client.query(sql.eventDate(), [dateId]);

        var results = [];
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return results;
        });
    });
};

var eventDateRota = function(dateId) {
    // Get a Postgres client from the connection pool
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        var query = client.query(sql.eventDateRota(), [dateId]);

        var results = [];
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return results;
        });
    });
};

router.route('/eventdates/:id')
    .get(apiAuthenticated, function(req, res) {
        var dateId = parseInt(req.params.id);

        async.parallel({
            summary: function(callback) {
                pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                    var query = client.query(sql.eventDate(), [dateId]);

                    var results = [];
                    query.on('row', function(row) {
                        results.push(row);
                    });

                    // After all data is returned, close connection and return results
                    query.on('end', function() {
                        client.end();
                        callback(null, results);
                    });
                });
            },

            roles: function(callback) {
                pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                    var query = client.query(sql.eventDateRoles(), [dateId]);

                    var results = [];
                    query.on('row', function(row) {
                        results.push(row);
                    });

                    // After all data is returned, close connection and return results
                    query.on('end', function() {
                        client.end();
                        callback(null, results);
                    });
                });
            },

            rota: function(callback) {
                pg.connect(process.env.DATABASE_URL, function(err, client, done) {
                    var query = client.query(sql.eventDateRota(), [dateId]);

                    var results = [];
                    query.on('row', function(row) {
                        results.push(row);
                    });

                    // After all data is returned, close connection and return results
                    query.on('end', function() {
                        client.end();
                        callback(null, results);
                    });
                });
            }

        }, function(err, results) {
            // results is now equals to: {summary: [], roles: [], rota: []}
            var eventDate = {summary:{}, roles: results.roles, rota: results.rota};
            if (results.summary.length > 0) {
                eventDate.summary = results.summary[0];
            }

            // Pivot roles by sequence
            var roles = eventDate.roles.reduce(function(prev, curr) {
                var seq = ('0000'+ curr.sequence).slice(-4);
                if (seq in prev) {
                    prev[seq].push(curr);
                } else {
                    prev[seq] = [curr];
                }
                return prev;
            }, {});
            eventDate.roles = roles;

            return res.json(eventDate);
        });
    });

module.exports = router;