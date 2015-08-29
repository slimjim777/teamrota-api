var request = require('request');
var $ = require('jquery');


var Person = {
    url: '/api/people',
    USERID: '1',

    me: function() {
        return $.get(this.url + '/permissions');
    },

    findById: function(personId) {
        if (!personId) {
            // Get the current user's details
            return $.get(this.url + '/me');
        } else {
            return $.get(this.url + '/' + personId);
        }
    },

    rota: function(personId) {
        return $.get(this.url + '/' + personId + '/rota');
    }

};

module.exports = Person;