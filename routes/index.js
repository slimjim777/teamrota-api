'use strict';
var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.sendFile(path.normalize(__dirname + '/../zzhome.html'));
    res.render('home', {});
});

module.exports = router;
