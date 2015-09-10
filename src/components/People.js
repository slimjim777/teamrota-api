'use strict';
var React = require('react');
var Person = require('../models/person');
var PeopleList = require('../components/PeopleList');


var People = React.createClass({

    getInitialState: function() {
        return ({peopleLoading: false, people: []});
    },

    componentDidMount: function () {
        var self = this;

        // Get the events
        self.getPeople();
    },

    getPeople: function() {
        var self = this;
        self.setState({peopleLoading: true});
        var result = Person.all();
        result.done(function(data) {
            self.setState({ people: data.people, peopleLoading: false });
        });
    },

    render: function () {
        return (
            <div id="main" className="container-fluid" role="main">
                <h2>People</h2>

                <PeopleList people={this.state.people} />
            </div>
        );
    }
});


module.exports = People;