'use strict';
var pg = require('pg');
var async = require('async');
var sql = require('../../utils/query');


var upsert = function(eventDateId, roleId, personId) {

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
};

module.exports = upsert;