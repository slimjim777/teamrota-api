var React = require('react');
var Person = require('../models/person');
var Rota = require('../components/Rota');

var RANGE = 12;

var MyRota = React.createClass({
    getInitialState: function () {
        return {person: {}, rota: [], rotaIsLoading: false, rotaRange: RANGE};
    },

    componentDidMount: function () {
        var self = this;

        // Get the person details
        var result = Person.findById();
        result.done(function(data) {
            self.setState({ person: data });
            self.getRota(data.id, RANGE);
            self.forceUpdate();
        });
    },

    getRota: function(personId, range) {
        var self = this;
        self.setState({rotaIsLoading: true});
        var result = Person.rota(personId, range);
        result.done(function(data) {
            self.setState({ rota: data.rota, rotaIsLoading: false });
        });
    },

    rotaRefreshClick: function(e) {
        e.preventDefault();
        this.getRota(this.state.person.id, this.state.rotaRange);
    },

    rotaRangePlus: function(e) {
        e.preventDefault();
        var range = this.state.rotaRange + RANGE;
        if (range === 0) {range = RANGE};
        this.setState({rotaRange: range});
        this.getRota(this.state.person.id, range);
    },

    rotaRangeMinus: function(e) {
        e.preventDefault();
        var range = this.state.rotaRange - RANGE;
        if (range === 0) {range = -RANGE};
        this.setState({rotaRange: range});
        this.getRota(this.state.person.id, range);
    },

    render: function () {
        return (
            <div id="main" className="container-fluid" role="main">
                <h2 className="sub-heading">{this.state.person.firstname} {this.state.person.lastname}</h2>
                <p className="sub-heading">{this.state.person.email}</p>
                <Rota personId={this.state.person.id} rota={this.state.rota} isLoading={this.state.rotaIsLoading}
                      rangeMinus={this.rotaRangeMinus} rangePlus={this.rotaRangePlus}
                      rotaRefreshClick={this.rotaRefreshClick} />
            </div>
        );
    }
});

module.exports = MyRota;