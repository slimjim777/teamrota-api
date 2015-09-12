'use strict';
var React = require('react');
var Person = require('../models/person');
var PeopleList = require('../components/PeopleList');


var People = React.createClass({

    getInitialState: function() {
        return ({peopleLoading: false, people: [], peopleFiltered: []});
    },

    componentDidMount: function () {
        $(document).on('filterChange', this.handleFilterChange);
        var self = this;

        // Get the events
        self.getPeople();
    },

    componentWillUnmount: function () {
        $(document).off('filterChange', this.handleFilterChange);
    },

    contains: function(value, snippet) {
        if (!value) {return false;}
        if (!snippet) {return true;}
        return value.toLowerCase().indexOf(snippet.toLowerCase()) >= 0;
    },

    handleFilterChange: function (e, firstName, lastName, status) {
        var self = this;
        var people = this.state.people.filter(function(p) {
            if (!self.contains(p.firstname, firstName)) {
                return false;
            }
            if (!self.contains(p.lastname, lastName)) {
                return false;
            }
            if ((status === 'active') && (!p.active)) {
                return false;
            }
            return !((status === 'inactive') && (p.active));
        });
        this.setState({peopleFiltered: people});
    },

    getPeople: function() {
        var self = this;
        self.setState({peopleLoading: true});
        var result = Person.all();
        result.done(function(data) {
            self.setState({ people: data.people, peopleLoading: false });
            self.handleFilterChange(null, null, null, 'active');
        });
    },

    render: function () {
        return (
            <div id="main" className="container-fluid" role="main">
                <h2>People</h2>

                <PeopleList people={this.state.peopleFiltered} />
            </div>
        );
    }
});


module.exports = People;