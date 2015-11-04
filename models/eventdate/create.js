'use strict';
var pg = require('pg');
var async = require('async');
var sql = require('../../utils/query');
var ModelEventDateRota = require('./rota');


var NewEventDate = function(ed) {
        async.series([
            function(callback) {
                // Get a Postgres client from the connection pool
                pg.connect(sql.databaseUrl(), function (err, client, done) {
                    // Create/update the event date, if it exists
                    var query = client.query(sql.upsertEventDate(),
                        [ed.eventId, ed.onDate, ed.focus, ed.notes, ed.url]);

                    query.on('end', function () {
                        client.end();
                        callback(null, null);
                    });
                });
            },

            function (callback) {
                // Get a Postgres client from the connection pool
                pg.connect(sql.databaseUrl(), function (err, client, done) {
                    // Get the ID of the created/updated event date
                    var query = client.query(sql.eventDateOnDate(), [ed.eventId, ed.onDate]);

                    var results = [];
                    query.on('row', function (row) {
                        results.push(row);
                    });

                    // After all data is returned, close connection and return results
                    query.on('end', function () {
                        client.end();
                        callback(null, results[0]);
                    });
                });
            }
        ], function (err, resultsArray) {
            var eventDateId = resultsArray[1].id;

            for (var r in ed.rota) {
                var rota = ed.rota[r];
                ModelEventDateRota(eventDateId, rota.roleId, rota.personId);
            }
        });
    };

module.exports = NewEventDate;
