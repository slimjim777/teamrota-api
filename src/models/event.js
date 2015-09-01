var request = require('request');
var $ = require('jquery');


var Event = {
    url: '/api/events',

    all: function () {
        return $.get(this.url);
    }
};

module.exports = Event;