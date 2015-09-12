'use strict';
var React = require('react');
var Router = require('react-router');
var EventModel = require('../models/event');
var Person = require('../models/person');
var EventDate = require('../models/eventdate');
var $ = require('jquery');
var EventDetailPanel = require('../components/EventDetailPanel');
var EventDetailRota = require('../components/EventDetailRota');
var EventDetailRotaEdit = require('../components/EventDetailRotaEdit');
var EventDetailDates = require('../components/EventDetailDates');


var EventDetail = React.createClass({

    getInitialState: function() {
        return ({eventLoading: false, model: {}, dateId: null, eventDate: {}, dateSummary: {}, rota: [], roles: [],
            eventDatesLoading: false, dates: [], user: null, isEditing: false});
    },

    componentDidMount: function () {
        $(document).on('dateTransition', this.handleDateChange);

        // Get the user permissions
        this.getPermissions();

        // Get the event
        var modelId = this.props.params.id;
        this.getEvent(modelId);
        this.getEventDates(modelId);

        var dateId = this.props.params.dateId;
        if (dateId) {
            this.getEventDate(dateId);
        }
    },

    componentWillUnmount: function () {
        $(document).off('dateTransition', this.handleDateChange);
    },

    getPermissions: function () {
        var self = this;
        var result = Person.permissions();
        result.done(function(user) {
            self.setState({user: user});
        });
    },

    canAdministrate: function() {
        if (!this.state.user) {
            return false;
        }
        if (this.state.user.role === 'admin') {
            return true;
        }
        if (!this.props.params.id) {
            return false;
        }
        var eventId = parseInt(this.props.params.id);
        for (var i=0; i < this.state.user.eventAdministrate.length; i++) {
            if (this.state.user.eventAdministrate[i].event_id === eventId) {
                return true;
            }
        }
        return false;
    },

    getEvent: function(modelId) {
        var self = this;
        self.setState({eventLoading: true });
        var result = EventModel.findById(modelId);
        result.done(function(data) {
            self.setState({model: data.model, eventLoading: false });
        });
    },

    getEventDates: function(modelId) {
        var self = this;
        self.setState({eventDatesLoading: true });
        var result = EventModel.dates(modelId);
        result.done(function(data) {
            if ((!self.state.dateId) && (data.dates.length > 0)) {
                var firstDate = data.dates[0];
                self.getEventDate(firstDate.id);
            }
            self.setState({dates: data.dates, eventDatesLoading: false});
        });
    },

    getEventDate: function(dateId) {
        var self = this;
        self.setState({eventDateLoading: true, dateId: parseInt(dateId)});
        var result = EventDate.findById(dateId);
        result.done(function(data) {
            self.setState({
                dateSummary: data.summary, rota: data.rota, roles: data.roles, dateId: dateId,
                eventDateLoading: false });
        });
    },

    handleDateChange: function(e, eventId, dateId) {
        this.getEventDate(dateId);
    },

    handleToggleEdit: function(e) {
        if (e) {
            e.preventDefault();
        }
        this.setState({isEditing: !this.state.isEditing});
    },

    refreshData: function() {
        this.setState({isEditing: false});
        this.getEventDate(this.state.dateId);
    },

    renderRota: function() {
        if (this.state.isEditing) {
            return (
                <EventDetailRotaEdit dateId={this.state.dateId} summary={this.state.dateSummary} rota={this.state.rota}
                                 canAdministrate={this.canAdministrate()} refreshData={this.refreshData}
                                     toggleEdit={this.handleToggleEdit} roles={this.state.roles} />
            );
        } else {
            return (
                <EventDetailRota dateId={this.state.dateId} summary={this.state.dateSummary} rota={this.state.rota}
                                 canAdministrate={this.canAdministrate()} toggleEdit={this.handleToggleEdit}/>
            );
        }
    },

    render: function () {
        var model = this.state.model;
        return (
            <div id="main" className="container-fluid" role="main">
                <h2 className="heading center">{model.name}</h2>
                <h4 className="center">Overview</h4>

                <div className="col-md-4 col-sm-4 col-xs-12">
                    <EventDetailDates eventDates={this.state.dates} canAdministrate={this.canAdministrate()}
                                      dateId={this.state.dateId}
                                      datesLoading={this.state.eventDatesLoading} />
                    <EventDetailPanel model={model} />
                </div>

                {this.renderRota()}
            </div>
        );
    }

});

module.exports = EventDetail;