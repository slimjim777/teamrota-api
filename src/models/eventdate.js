var request = require('request');
var $ = require('jquery');


var EventDate = {
    url: '/api/eventdates',

    findById: function(modelId) {
        return $.get(this.url + '/' + modelId);
    },

    updateRota: function(modelId, rolePerson) {
        // Expecting dictionary: {role_id: person_id}
        return $.post(this.url + '/' + modelId + '/rota', rolePerson);
    }
};

module.exports = EventDate;