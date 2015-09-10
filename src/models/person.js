'use strict';
var request = require('request');
var $ = require('jquery');


var Person = {
    url: '/api/people',

    permissions: function() {
        return $.get(this.url + '/permissions');
    },

    all: function () {
        return $.get(this.url);
    },

    findById: function(personId) {
        if (!personId) {
            // Get the current user's details
            return $.get(this.url + '/me');
        } else {
            return $.get(this.url + '/' + personId);
        }
    },

    rota: function(personId, range) {
        return $.post(this.url + '/' + personId + '/rota', {range: range});
    },

    awayDates: function(personId, range) {
        return $.post(this.url + '/' + personId + '/away', {range: range});
    }
};

module.exports = Person;