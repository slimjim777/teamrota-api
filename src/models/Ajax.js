'use strict';
var $ = require('jquery');


// Wrapper for API calls to add the authorization header
var Ajax = {
    get: function(url) {
        return $.ajax(url, {
            headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')}
        });
    },

    post: function(url, data) {
        return $.ajax(url, {
            headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')},
            dataType: 'json',
            data: data,
            method: 'POST'
        });
    }
};

module.exports = Ajax;