var PEOPLE = [
    {id: '1', firstname: 'Marty', lastname:'McFly', email: 'marty@mcfly.com'},
    {id: '2', firstname: 'Emmet', lastname:'Brown', email: 'emmet@brown.com'},
    {id: '3', firstname: 'Biff', lastname:'Tannen', email: 'biff@tannen.com'},
    {id: '4', firstname: 'Biff', lastname:'Tannen', email: 'biff@tannen.com'},
]

var Person = {

    USERID: '1',

    findById: function(personId) {
        // Use a fixture for now
        var index = parseInt(personId) - 1;
        if (index >= PEOPLE.length) {
            index = 4;
        }
        return {'response': 'Success', person: PEOPLE[index]}
    }

}

module.exports = Person;