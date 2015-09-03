var request = require('request');
var $ = require('jquery');


var EventDate = {
    url: '/api/eventdates',

    findById: function(modelId) {
        return $.get(this.url + '/' + modelId);
    }
};

module.exports = EventDate;