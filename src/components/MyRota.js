var React = require('react');
var Person = require('../models/person');
var Rota = require('../components/Rota');


var MyRota = React.createClass({
    getInitialState: function () {
        return {person: {}, rota: [], rotaIsLoading: false};
    },

    componentDidMount: function () {
        var self = this;

        // Get the person details
        var result = Person.findById();
        result.done(function(data) {
            self.setState({ person: data });
            self.getRota(data.id);
            self.forceUpdate();
        });
    },

    getRota: function(personId) {
        var self = this;
        self.setState({rotaIsLoading: true});
        var result = Person.rota(personId);
        result.done(function(data) {
            self.setState({ rota: data, rotaIsLoading: false });
        });
    },

    rotaRefreshClick: function(e) {
        e.preventDefault();
        this.getRota(this.state.person.id);
    },

    render: function () {
        return (
            <div id="main" className="container-fluid" role="main">
                <h2 className="sub-heading">{this.state.person.firstname} {this.state.person.lastname}</h2>
                <p className="sub-heading">{this.state.person.email}</p>
                <Rota personId={this.state.person.id} rota={this.state.rota} isLoading={this.state.rotaIsLoading}
                    rotaRefreshClick={this.rotaRefreshClick} />
            </div>
        );
    }
});

module.exports = MyRota;