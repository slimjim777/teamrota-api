var React = require('react');
var Person = require('../models/person');


var MyRota = React.createClass({
    getInitialState: function () {
        return {person: {}};
    },

    componentDidMount: function () {
        var id = this.props.params.id;
        if (!id) {
            id = Person.USERID;
        }
        console.log(id);
        var result = Person.findById(id);
        this.setState({ person: result.person });
    },

    render: function () {
        return (
            <div>
                <h2 className="sub-heading">{this.state.person.firstname} {this.state.person.lastname}</h2>
                <p className="sub-heading">{this.state.person.email}</p>
            </div>
        );
    }
});

module.exports = MyRota;