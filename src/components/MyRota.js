var React = require('react');
var Person = require('../models/person');
var Rota = require('../components/Rota');
var AwayDates = require('../components/AwayDates');

var RANGE = 12;

var MyRota = React.createClass({
    getInitialState: function () {
        return {
            person: {},
            rota: [], rotaIsLoading: false, rotaRange: RANGE,
            awayDates: [], awayIsLoading: false, awayRange: RANGE
        };
    },

    componentDidMount: function () {
        var self = this;

        // Get the person details
        var result = Person.findById();
        result.done(function(data) {
            self.setState({ person: data });
            self.getRota(data.id, RANGE);
            self.getAwayDates(data.id, RANGE);
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

    getAwayDates: function(personId, range) {
        var self = this;
        self.setState({awayIsLoading: true});
        var result = Person.awayDates(personId, range);
        result.done(function(data) {
            self.setState({ awayDates: data.awayDates, awayIsLoading: false });
        });
    },

    rotaRefreshClick: function(e) {
        e.preventDefault();
        this.getRota(this.state.person.id, this.state.rotaRange);
    },

    rotaRangePlus: function(e) {
        e.preventDefault();
        var range = this.state.rotaRange + RANGE;
        if (range === 0) {range = RANGE}
        this.setState({rotaRange: range});
        this.getRota(this.state.person.id, range);
    },

    rotaRangeMinus: function(e) {
        e.preventDefault();
        var range = this.state.rotaRange - RANGE;
        if (range === 0) {range = -RANGE}
        this.setState({rotaRange: range});
        this.getRota(this.state.person.id, range);
    },

    awayRefreshClick: function (e) {
        e.preventDefault();
        this.getAwayDates(this.state.person.id, RANGE);
    },

    awayRangePlus: function (e) {
        e.preventDefault();
        var range = this.state.awayRange + RANGE;
        if (range === 0) {range = RANGE}
        this.setState({awayRange: range});
        this.getAwayDates(this.state.person.id, range);
    },

    awayRangeMinus: function (e) {
        e.preventDefault();
        var range = this.state.awayRange - RANGE;
        if (range === 0) {range = -RANGE}
        this.setState({awayRange: range});
        this.getAwayDates(this.state.person.id, range);
    },

    rotaRangeMessage: function () {
        if (this.state.rotaRange == RANGE) {return}
        if (this.state.rotaRange > 0) {
            return 'Next ' + (this.state.rotaRange - RANGE) + ' to ' + this.state.rotaRange + ' weeks';
        } else {
            return 'Previous ' + Math.abs(this.state.rotaRange + RANGE) + ' to ' + (-this.state.rotaRange) + ' weeks';
        }
    },

    awayRangeMessage: function () {
        if (this.state.awayRange == RANGE) {return}
        if (this.state.awayRange > 0) {
            return 'Next ' + (this.state.awayRange - RANGE) + ' to ' + this.state.awayRange + ' weeks';
        } else {
            return 'Previous ' + Math.abs(this.state.awayRange + RANGE) + ' to ' + (-this.state.awayRange) + ' weeks';
        }
    },

    render: function () {
        return (
            <div id="main" className="container-fluid" role="main">
                <h2 className="sub-heading">{this.state.person.firstname} {this.state.person.lastname}</h2>
                <p className="sub-heading">{this.state.person.email}</p>
                <Rota personId={this.state.person.id} rota={this.state.rota} isLoading={this.state.rotaIsLoading}
                      rangeMessage={this.rotaRangeMessage()}
                      rangeMinus={this.rotaRangeMinus} rangePlus={this.rotaRangePlus}
                      rotaRefreshClick={this.rotaRefreshClick} />
                <AwayDates personId={this.state.person.id} awayDates={this.state.awayDates}
                           rangeMessage={this.awayRangeMessage()}
                           rangeMinus={this.awayRangeMinus} rangePlus={this.awayRangePlus}
                           isLoading={this.state.awayIsLoading} awayRefreshClick={this.awayRefreshClick} />
            </div>
        );
    }
});

module.exports = MyRota;