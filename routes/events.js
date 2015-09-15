'use strict';
var express = require('express');
var router = express.Router();
var pg = require('pg');
var moment = require('moment');
var sql = require('../utils/query');


router.route('/events')
    .get(function(req, res) {
        // Get a Postgres client from the connection pool
        pg.connect(sql.databaseUrl(), function(err, client, done) {
            var query = client.query(sql.events());

            var results = [];
            query.on('row', function(row) {
                results.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function() {
                client.end();
                return res.json({events: results});
            });
        });
    });

router.route('/events/:id')
    .get(function(req, res) {
        var eventId = parseInt(req.params.id);

        // Get a Postgres client from the connection pool
        pg.connect(sql.databaseUrl(), function(err, client, done) {
            var query = client.query(sql.eventDetail(), [eventId]);

            var results = [];
            query.on('row', function(row) {
                results.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function() {
                var model = {};
                if (results.length > 0) {
                    model = results[0];
                }

                client.end();
                return res.json({model: model});
            });
        });
    });

router.route('/events/:id/dates')
    .get(function(req, res) {
        var eventId = parseInt(req.params.id);

        // Get a Postgres client from the connection pool
        pg.connect(sql.databaseUrl(), function(err, client, done) {
            var fromDate = moment().format('YYYY-MM-DD');
            var query = client.query(sql.eventDates(), [eventId, fromDate]);

            var results = [];
            query.on('row', function(row) {
                results.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function() {
                client.end();
                return res.json({dates: results});
            });
        });
    });

module.exports = router;