var React = require('react');
var Router = require('react-router');
var Event = require('../models/event');
var EventDate = require('../models/eventdate');
var $ = require('jquery');
var EventDetailPanel = require('../components/EventDetailPanel');
var EventDetailRota = require('../components/EventDetailRota');
var EventDetailDates = require('../components/EventDetailDates');


var EventDetail = React.createClass({

    mixins: [Router.Navigation],

    getInitialState: function() {
        return ({eventLoading: false, model: {}, dateId: null, eventDate: {}, dateSummary: {}, rota: [], role: [],
            eventDatesLoading: false, dates: []});
    },

    componentDidMount: function () {
        $(document).on('dateTransition', this.handleDateChange);

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

    getEvent: function(modelId) {
        var self = this;
        self.setState({eventLoading: true });
        var result = Event.findById(modelId);
        result.done(function(data) {
            self.setState({model: data.model, eventLoading: false });
        });
    },

    getEventDates: function(modelId) {
        var self = this;
        self.setState({eventDatesLoading: true });
        var result = Event.dates(modelId);
        result.done(function(data) {
            self.setState({dates: data.dates, eventDatesLoading: false });
        });
    },

    getEventDate: function(dateId) {
        var self = this;
        self.setState({eventDateLoading: true, dateId: parseInt(dateId)});
        var result = EventDate.findById(dateId);
        result.done(function(data) {
            self.setState({dateSummary: data.summary, rota: data.rota, roles: data.roles, eventDateLoading: false });
        });
    },

    handleDateChange: function(e, eventId, dateId) {
        this.getEventDate(dateId);
    },

    render: function () {
        var model = this.state.model;
        return (
            <div id="main" className="container-fluid" role="main">
                <h2 className="heading center">{model.name}</h2>
                <h4 className="center">Overview</h4>

                <div className="col-md-4 col-sm-4 col-xs-12">
                    <EventDetailDates eventDates={this.state.dates} canAdministrate={false}
                                      dateId={this.state.dateId}
                                      datesLoading={this.state.eventDatesLoading} />
                    <EventDetailPanel model={model} />
                </div>

                <EventDetailRota model={model} summary={this.state.dateSummary} rota={this.state.rota} />
            </div>
        );
    }

});

module.exports = EventDetail;