'use strict';
var express = require('express');
var router = express.Router();
var pg = require('pg');
var moment = require('moment');
var sql = require('../utils/query');
var async = require('async');
var OVERVIEW_WEEKS = require('../utils/constants').OVERVIEW__WEEKS;


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

router.route('/events/:id/date/:onDate')
    .get(function(req, res) {
        var eventId = parseInt(req.params.id);
        var onDate = req.params.onDate;

        async.parallel({
            summary: function(callback) {
                pg.connect(sql.databaseUrl(), function(err, client, done) {
                    var query = client.query(sql.eventDateOnDate(), [eventId, onDate]);

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
                pg.connect(sql.databaseUrl(), function(err, client, done) {
                    var query = client.query(sql.rolesForDate(), [eventId, onDate]);

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
                pg.connect(sql.databaseUrl(), function(err, client, done) {
                    var query = client.query(sql.eventDateRotaOnDate(), [eventId, onDate]);

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

            // Convert to an array
            var roleArray = [];
            for (var prop in roles) {
                if (roles.hasOwnProperty(prop)) {
                    var roleList = roles[prop];
                    var roleName = '';
                    var roleId = null;
                    if (roleList.length > 0) {
                        roleName = roleList[0].role_name;
                        roleId = roleList[0].role_id;
                    }

                    // Find the person in the rota for the role
                    var personId = null;
                    for (var i=0; i < results.rota.length; i++) {
                        var rota = results.rota[i];
                        if (rota.role_id === roleId) {
                            personId = rota.person_id;
                            break;
                        }
                    }

                    // Reformat the role info for display
                    var roleRota = {
                        roleId: roleId,
                        roleName: roleName,
                        roles: roleList,
                        personId: personId
                    };
                    roleArray.push(roleRota);
                }
            }
            eventDate.roles = roleArray;

            return res.json(eventDate);
        });


    });

router.route('/events/:id/roles')
    .get(function(req, res) {
        var eventId = parseInt(req.params.id);

        // Get a Postgres client from the connection pool
        pg.connect(sql.databaseUrl(), function(err, client, done) {
            var query = client.query(sql.rolesForEvent(), [eventId]);

            var results = [];
            query.on('row', function(row) {
                results.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function() {
                client.end();
                return res.json({roles: results});
            });
        });
    });


// Pivot the rota data on the rota dates
function checkRotaForDate(currentDate, records, roles) {
    var eventDetail = {on_date: currentDate, roles: {}}
    for (var i=0; i<records.length; i++) {
        // Check if we have a rota for the date
        var rota = records[i];
        var onDate = moment(rota.on_date).format('YYYY-MM-DD');

        if (onDate > currentDate) {
            break;
        }

        if (currentDate === onDate) {
            eventDetail.roles[rota.role_id] = rota;
            //eventDetail.roles.push(rota);
            if (!eventDetail.focus) {
                eventDetail.event_date_id = rota.event_date_id;
                eventDetail.focus = rota.focus;
                eventDetail.notes = rota.notes;
                eventDetail.url = rota.url;
            }
        }
    }

    // Fill in the blanks for the unassigned roles
    for (var i=0; i<roles.length; i++) {
        var role = roles[i];
        if (!eventDetail.roles[role.id]) {
            eventDetail.roles[role.id] = {};
        }
    }

    return eventDetail;
}


router.route('/events/:id/rota/:fromDate')
    .get(function(req, res) {
        var eventId = parseInt(req.params.id);
        var fromDate = req.params.fromDate;
        var toDate = moment(fromDate).add(OVERVIEW_WEEKS, 'weeks').format('YYYY-MM-DD');
        var eventDetail = null;

        async.series([
            // Get the event record for the recurrence details
            function (callback) {
                // Get a Postgres client from the connection pool
                pg.connect(sql.databaseUrl(), function (err, client, done) {
                    var query = client.query(sql.eventDetail(), [eventId]);

                    var results = [];
                    query.on('row', function (row) {
                        results.push(row);
                    });

                    // After all data is returned, close connection and return results
                    query.on('end', function () {
                        client.end();
                        eventDetail = results[0];
                        callback(null, eventDetail);
                    });
                });
            },
            // Get the roles for the event
            function (callback) {
                // Get a Postgres client from the connection pool
                pg.connect(sql.databaseUrl(), function (err, client, done) {
                    var query = client.query(sql.rolesForEvent(), [eventId]);

                    var results = [];
                    query.on('row', function (row) {
                        results.push(row);
                    });

                    // After all data is returned, close connection and return results
                    query.on('end', function () {
                        client.end();
                        callback(null, results);
                    });
                });
            },
            // Get rotas for the date period
            function (callback) {
                // Get a Postgres client from the connection pool
                pg.connect(sql.databaseUrl(), function (err, client, done) {
                    var query = client.query(sql.eventRota(), [eventId, fromDate, toDate]);

                    var results = [];
                    query.on('row', function (row) {
                        results.push(row);
                    });

                    // After all data is returned, close connection and return results
                    query.on('end', function () {
                        client.end();
                        callback(null, results);
                    });
                });

            }],
            function (err, resultsArray) {
                if (err) {
                    console.log('Error-----');
                    console.log(err);
                    return res.json({error: err});
                }

                var roles = resultsArray[1];
                var records = resultsArray[2];

                // Generate full list of rota dates for the time period
                var frequency = 'weeks';
                if (eventDetail.frequency === 'irregular') {frequency = 'irregular'};
                if (eventDetail.frequency === 'monthly') {frequency = 'months'};

                // Get the nearest Sunday from the 'from date'
                var currentDate = moment(fromDate).day(0);
                var rotaDates = [];
                while(currentDate.isBefore(toDate)) {
                    var rotaForDate = {};
                    if (frequency === 'weeks') {
                        if (eventDetail.day_sun) {
                            rotaForDate = checkRotaForDate(currentDate.day(0).format('YYYY-MM-DD'), records, roles);
                            rotaDates.push(rotaForDate);
                        }
                        if (eventDetail.day_mon) {
                            rotaForDate = checkRotaForDate(currentDate.day(1).format('YYYY-MM-DD'), records, roles);
                            rotaDates.push(rotaForDate);
                        }
                        if (eventDetail.day_tue) {
                            rotaForDate = checkRotaForDate(currentDate.day(2).format('YYYY-MM-DD'), records, roles);
                            rotaDates.push(rotaForDate);
                        }
                        if (eventDetail.day_wed) {
                            rotaForDate = checkRotaForDate(currentDate.day(3).format('YYYY-MM-DD'), records, roles);
                            rotaDates.push(rotaForDate);
                        }
                        if (eventDetail.day_thu) {
                            rotaForDate = checkRotaForDate(currentDate.day(4).format('YYYY-MM-DD'), records, roles);
                            rotaDates.push(rotaForDate);
                        }
                        if (eventDetail.day_fri) {
                            rotaForDate = checkRotaForDate(currentDate.day(5).format('YYYY-MM-DD'), records, roles);
                            rotaDates.push(rotaForDate);
                        }
                        if (eventDetail.day_sat) {
                            rotaForDate = checkRotaForDate(currentDate.day(6).format('YYYY-MM-DD'), records, roles);
                            rotaDates.push(rotaForDate);
                        }
                        currentDate = currentDate.add(1, 'weeks');
                    }
                }

                return res.json({rota: rotaDates});
            });
    });


module.exports = router;