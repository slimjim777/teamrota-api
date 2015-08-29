var pg = require('pg');


var utils = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    },
    apiAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401).send({success: false, message: 'NOT authenticated.'});
    }
 }


module.exports = utils;