'use strict';
var Ajax = require('./Ajax');


var EventModel = {
    url: '/api/events',

    all: function () {
        return Ajax.get(this.url);
    },

    findById: function(modelId) {
        return Ajax.get(this.url + '/' + modelId);
    },

    dates: function(modelId) {
        return Ajax.get(this.url + '/' + modelId + '/dates');
    }
};

module.exports = EventModel;