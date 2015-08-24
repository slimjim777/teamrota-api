var express = require('express');
var router = express.Router();
var path = require('path');
var ensureAuthenticated = require('../utils/utils').ensureAuthenticated;


// GET the /rota URL
router.get('/', ensureAuthenticated, function(req, res, next) {
    res.sendFile(path.normalize(__dirname + '/../index.html'));
});

module.exports = router;
