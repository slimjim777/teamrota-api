var express = require('express');
var router = express.Router();
var pg = require('pg');
var moment = require('moment');
var apiAuthenticated = require('../utils/utils').apiAuthenticated;
var sql = require('../utils/query');

var RANGE = 12;


function datesFromRange(rangeParam) {
    // Calculate the from and to dates
    var range = parseInt(rangeParam);
    var fromDate;
    var toDate;
    if (range > 0) {
        fromDate = moment().add(range - RANGE, 'weeks');
        toDate = moment().add(range, 'weeks');
    } else {
        fromDate = moment().add(range, 'weeks');
        toDate = moment().add(range + RANGE, 'weeks');
    }
    return [fromDate, toDate];
}

router.route('/people')
    .get(apiAuthenticated, function(req, res) {
        res.err(new Error('GET Not implemented'));
    })
    .post(apiAuthenticated, function(req, res) {
        res.err(new Error('POST Not implemented'));
    });

router.route('/people/permissions')
    .get(apiAuthenticated, function(req, res) {
        res.json(req.session.user);
    });

router.route('/people/me')
    .get(apiAuthenticated, function(req, res) {

        // Get a Postgres client from the connection pool
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {

            var query = client.query("SELECT * FROM person WHERE id=($1)", [req.session.user.userId]);

            var results = [];
            query.on('row', function(row) {
                results.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function() {
                client.end();
                return res.json(results[0]);
            });
        });
    });

router.route('/people/:id')
    .get(apiAuthenticated, function(req, res) {
        var index = parseInt(req.params.id) - 1;
        if (index >= PEOPLE.length) {
            index = 4;
        }
        var person = PEOPLE[index];
        res.json(person);
    });

router.route('/people/:id/rota')
    .post(apiAuthenticated, function(req, res) {
        // Calculate the from and to dates
        var dates = datesFromRange(req.body.range);
        var fromDate = dates[0];
        var toDate = dates[1];

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            var query = client.query(
                sql.rotaForPerson(), [req.params.id, fromDate.format('YYYY-MM-DD'), toDate.format('YYYY-MM-DD')]);

                var results = [];
                query.on('row', function(row) {
                    results.push(row);
                });

                // After all data is returned, close connection and return results
                query.on('end', function() {
                    // Pivot the data to group it by date and event name
                    var prevDate = null;
                    var rotaList = [];
                    var currentDate = null;
                    for (var i=0; i<results.length; i++) {
                        var item = results[i];

                        // Check if we've changed dates
                        if (prevDate !== item.event_date_id) {
                            // Save the list so far
                            if (prevDate) {
                                rotaList.push(currentDate);
                            }

                            // Start a new current date
                            currentDate = {
                                eventId: item.event_id,
                                eventDate: item.on_date,
                                isAway: item.is_away,
                                eventName: item.event_name,
                                roles:[]
                            };
                            prevDate = item.event_date_id;
                        }

                        // Add the current role to the list of roles for the date and event
                        currentDate.roles.push(item.role_name);
                    }

                    // Handle the last record
                    if (results.length > 0) {
                        rotaList.push(currentDate);
                    }

                    client.end();
                    return res.json({rota:rotaList});
                });
        });
    });

router.route('/people/:id/away')
    .post(apiAuthenticated, function(req, res) {
        // Calculate the from and to dates
        var dates = datesFromRange(req.body.range);
        var fromDate = dates[0];
        var toDate = dates[1];

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            var query = client.query(
                sql.awayDateForPerson(), [req.params.id, fromDate.format('YYYY-MM-DD'), toDate.format('YYYY-MM-DD')]);

            var results = [];
            query.on('row', function (row) {
                results.push({
                    id: row.id,
                    personId: row.person_id,
                    fromDate: row.from_date,
                    toDate: row.to_date
                });
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                client.end();
                return res.json({awayDates: results});
            });
        });
    });

module.exports = router;