'use strict';
var $ = require('jquery');


var Token = {
    get: function() {
        return $.get('/rota/token')
            .done(function(response) {
                sessionStorage.setItem('token', response.token);
                return response.token;
            });
    }
}

module.exports = Token;