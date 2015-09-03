var request = require('request');
var $ = require('jquery');


var Event = {
    url: '/api/events',

    all: function () {
        return $.get(this.url);
    },

    findById: function(modelId) {
        return $.get(this.url + '/' + modelId);
    },

    dates: function(modelId) {
        return $.get(this.url + '/' + modelId + '/dates');
    }
};

module.exports = Event;