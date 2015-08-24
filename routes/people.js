var express = require('express');
var router = express.Router();
var pg = require('pg');
var apiAuthenticated = require('../utils/utils').apiAuthenticated;

var PEOPLE = [
    {id: '1', firstname: 'Marty', lastname:'McFly', email: 'marty@mcfly.com'},
    {id: '2', firstname: 'Emmet', lastname:'Brown', email: 'emmet@brown.com'},
    {id: '3', firstname: 'Biff', lastname:'Tannen', email: 'biff@tannen.com'},
    {id: '4', firstname: 'Biff', lastname:'Tannen', email: 'biff@tannen.com'},
];


router.route('/people')
    .get(apiAuthenticated, function(req, res) {
        console.log('people get');
        res.json(PEOPLE);
    })
    .post(apiAuthenticated, function(req, res) {
        res.err(new Error('POST Not implemented'));
    });

router.route('/people/permissions')
    .get(apiAuthenticated, function(req, res) {
        res.json(req.session);
    });

router.route('/people/me')
    .get(apiAuthenticated, function(req, res) {

        // Get a Postgres client from the connection pool
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {

            var query = client.query("SELECT * FROM person WHERE id=($1)", [req.session.userId])

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
        console.log('people get: ' + req.params.id);
        var index = parseInt(req.params.id) - 1;
        if (index >= PEOPLE.length) {
            index = 4;
        }
        var person = PEOPLE[index];
        res.json(person);
    });


module.exports = router;