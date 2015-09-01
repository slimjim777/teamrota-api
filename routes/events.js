var express = require('express');
var router = express.Router();
var pg = require('pg');
var moment = require('moment');
var apiAuthenticated = require('../utils/utils').apiAuthenticated;
var sql = require('../utils/query');


router.route('/events')
    .get(apiAuthenticated, function(req, res) {
        // Get a Postgres client from the connection pool
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
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

module.exports = router;