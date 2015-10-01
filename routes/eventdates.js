'use strict';
var express = require('express');
var router = express.Router();
var pg = require('pg');
var async = require('async');
var moment = require('moment');
var sql = require('../utils/query');


var eventDateSummary = function(dateId) {
    // Get a Postgres client from the connection pool
    pg.connect(sql.databaseUrl(), function(err, client, done) {
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
    pg.connect(sql.databaseUrl(), function(err, client, done) {
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
    .get(function(req, res) {
        var dateId = parseInt(req.params.id);

        async.parallel({
            summary: function(callback) {
                pg.connect(sql.databaseUrl(), function(err, client, done) {
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
                pg.connect(sql.databaseUrl(), function(err, client, done) {
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
                pg.connect(sql.databaseUrl(), function(err, client, done) {
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

router.route('/eventdates/:id/eventdate')
    .put(function(req, res) {
        var eventDateId = parseInt(req.params.id);
        var ed = req.body;

        pg.connect(sql.databaseUrl(), function (err, client, done) {
            var query = client.query(sql.updateEventDate(), [eventDateId, ed.focus, ed.notes, ed.url]);

            query.on('end', function () {
                client.end();
                res.json({result: 'done'});
            });
        });
    });

router.route('/eventdates/:id/rota')
    .post(function(req, res) {
        var eventDateId = parseInt(req.params.id);
        var rolePerson = req.body;
        var roleId = rolePerson.roleId

        // An id of 0 means we're deselecting the person for the role
        var personId = parseInt(rolePerson.personId);

        async.series([
            function (callback) {
                pg.connect(sql.databaseUrl(), function (err, client, done) {
                    // Look for a role entry for this person
                    var query = client.query(sql.rotaForRole(), [eventDateId, roleId]);

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
                var query = null;
                var records = resultsArray[0];

                pg.connect(sql.databaseUrl(), function (err, client, done) {
                    if (records.length === 0) {
                        // Not found: add a new rota record
                        if (personId > 0) {
                            query = client.query(sql.addRotaForRole(), [eventDateId, parseInt(roleId), personId]);
                        }
                    } else {
                        var record = records[0];
                        if (personId > 0) {
                            // Update the person
                            query = client.query(sql.updateRotaForRole(), [parseInt(record.id), personId]);
                        } else {
                            // Delete for 0-id
                            query = client.query(sql.deleteRotaForPerson(), [parseInt(record.id)]);
                        }
                    }

                    // After all data is returned, close connection and return results
                    if (query) {
                        query.on('end', function () {
                            client.end();
                        });
                    }
                });
            });

        res.json({result: 'done'});
    });


module.exports = router;