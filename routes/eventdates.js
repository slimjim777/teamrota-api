'use strict';
var express = require('express');
var router = express.Router();
var pg = require('pg');
var async = require('async');
var moment = require('moment');
var sql = require('../utils/query');
var ModelEventDateCreate = require('../models/eventdate/create');
var ModelEventDateRota = require('../models/eventdate/rota');


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


router.route('/eventdates')
    .post(function(req, res) {
        var ed = req.body;

        ModelEventDateCreate(ed);
        res.json({result: 'done'});
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

        ModelEventDateRota(eventDateId, roleId, personId);
        res.json({result: 'done'});
    });

router.route('/eventdates/:id/roles')
    .post(function(req, res) {
        var eventDateId = parseInt(req.params.id);

        pg.connect(sql.databaseUrl(), function(err, client, done) {
            var query = client.query(sql.eventDateRoles(), [eventDateId]);

            var results = {};
            query.on('row', function(row) {
                if (results[row.role_id]) {
                    results[row.role_id].push(row);
                } else {
                    results[row.role_id] = [{person_id:0, firstname:'', lastname:''}, row];
                }
            });

            // After all data is returned, close connection and return results
            query.on('end', function() {
                client.end();
                res.json({roles: results});
            });
        });
    });

module.exports = router;