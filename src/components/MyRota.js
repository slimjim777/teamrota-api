var React = require('react');
var Person = require('../models/person');


var MyRota = React.createClass({
    getInitialState: function () {
        return {person: {}};
    },

    componentDidMount: function () {
        var self = this;

        var result = Person.findById();
        result.done(function(data) {
            self.setState({ person: data });
            self.forceUpdate();
        });
    },

    componentWillUnmount: function () {
        $(document).off("dataChange", this.callback);
    },

    render: function () {
        return (
            <div id="main" className="container-fluid" role="main">
                <h2 className="sub-heading">{this.state.person.firstname} {this.state.person.lastname}</h2>
                <p className="sub-heading">{this.state.person.email}</p>
            </div>
        );
    }
});

module.exports = MyRota;